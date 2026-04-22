import os
import shutil
import tempfile
import logging
from google import genai 
from typing import Dict, Any 
import stat 

class AIScanner:
    def __init__(self, api_key: str):
        self.client= genai.Client(api_key= api_key)

    async def scan_repo(self, repo_url: str) -> Dict[str, Any]:
        """Clones a repo and lets Gemini analyze it"""
        # We create a temporary safe room to download the code
        temp_dir= tempfile.mkdtemp()
        try:
            logging.info(f"Downloading code from {repo_url}...")

            # We use git to clone only the latest version of the code
            os.system(f"git clone --depth 1 {repo_url} {temp_dir}")

            # We gather the code to show the AI
            code_context= self._get_code_context(temp_dir)

            if not code_context:
                return {"error": "This repository is empty or has no code files!"}

            # The Prompt: Tells Gemini exactly how to act
            prompt = f"""
            Act as a Senior Security Engineer and System Architect.
            Analyse this repository code for Security Vulnerabilities, Performance Bottlenecks, and Architecture quality. 
            
            IMPORTANT: Return the results ONLY in a valid JSON format with the following keys:
            1. "explanation": A detailed multi-paragraph technical breakdown of the code quality and architecture.
            2. "issues": A list of objects, each containing "title" and "description" for specific bugs or security flaws.
            
            Code Context:
            {code_context[:30000]}
            """

            response= self.client.models.generate_content(
                model= "gemini-2.0-flash",
                contents= prompt,
            )
            
            return {"raw_report": response.text, "status": "success"}
    
        finally:
            # We destroy the temporary code room to keep your computer clean
            shutil.rmtree(temp_dir, onerror= on_rm_error)

    def _get_code_context(self, path: str) -> str:
        """Helper to read code files (.py, .js, etc.)"""
        context= ""
        exts = ('.py', '.js', '.ts', '.go', '.java', '.rs', '.ps1', '.ipynb', '.cpp', '.h', '.c', '.sh', '.yaml', '.yml', '.md', '.json')
        for root, _, files in os.walk(path):
            for file in files:
                if file.endswith(exts):
                    with open(os.path.join(root, file), 'r', encoding= 'utf-8', errors= 'ignore') as f:
                        context += f"\n-- {file} ---\n{f.read()}\n"
        
        return context

def  on_rm_error(func, path, exc_info):
    os.chmod(path, stat.S_IWRITE)
    func(path)
