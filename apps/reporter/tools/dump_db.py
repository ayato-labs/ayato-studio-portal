import asyncio

import httpx


import os

async def dump_data():
    url = os.getenv("SUPABASE_URL", "https://jzysvoduyrtjxyzcwnup.supabase.co/rest/v1/generated_reports")
    key = os.getenv("SUPABASE_KEY", "")
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
    }
    params = {"select": "id,title,generated_at", "order": "generated_at.desc", "limit": 100}
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.get(url, headers=headers, params=params)
        if resp.status_code == 200:
            data = resp.json()
            if not data:
                print("DB IS EMPTY (generated_reports)")
            else:
                for entry in data:
                    print(f"[{entry['generated_at']}] {entry['title']}")
        else:
            print(f"Error {resp.status_code}: {resp.text}")


if __name__ == "__main__":
    asyncio.run(dump_data())
