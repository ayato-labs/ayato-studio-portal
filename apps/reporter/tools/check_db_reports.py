import os
from datetime import datetime

from dotenv import load_dotenv
from supabase import Client, create_client

# Load environment variables from reporter's .env
load_dotenv(dotenv_path="c:/Users/saiha/My_Service/AI-agent/product/ayato_reporter/.env")

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)


def check_latest_reports():
    print(f"Checking Supabase for reports from today ({datetime.now().strftime('%Y-%m-%d')})...")
    try:
        response = (
            supabase.table("generated_reports")
            .select("title, category, created_at, filename")
            .order("created_at", desc=True)
            .limit(10)
            .execute()
        )

        data = response.data
        if not data:
            print("No reports found in generated_reports.")
            return

        print(f"Found {len(data)} recent reports:")
        for r in data:
            print(f"- [{r['created_at']}] {r['title']} ({r['category']})")

    except Exception as e:
        print(f"Error checking DB: {e}")


if __name__ == "__main__":
    check_latest_reports()
