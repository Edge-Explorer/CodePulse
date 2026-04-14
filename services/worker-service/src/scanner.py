import os
import shutil
import tempfile
import logging
import google.generativeai as genai 
from typing import Dict, Any 

class AIScanner:
    def __init__(self, api_key: str):
        genai.configure(api_key= api_key)
        self.model= genai.GenerativeModel('gemini-2.0-flash')

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
            Analyse this repository code for Security Bugs and Architecture quality. 
            Return the results in a professional JSON format.
            
            Code Context:
            {code_context[:30000]}
            """

            response= self.model.generate_content(prompt)
            return {"raw_report": response.text, "status": "success"}

        finally:
            # We destroy the temporary code room to keep your computer clean
            shutil.rmtree(temp_dir)

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
