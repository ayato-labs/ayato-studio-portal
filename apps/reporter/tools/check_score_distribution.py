import asyncio

from config import settings
from core.storage.supabase_storage import SupabaseStorage


async def main():
    db = SupabaseStorage(settings.SUPABASE_URL, settings.SUPABASE_KEY)

    # Check score distribution for items fetched today
    resp = await db._request(
        "GET",
        "ai_scores",
        params={
            "select": "score,reason",
            "scored_at": "gte.2026-04-05",
            "order": "score.desc",
            "limit": 10,
        },
    )
    scores = resp.json()
    print("--- Score Distribution (Top 10) ---")
    for s in scores:
        print(f"Score: {s['score']} | Reason: {s['reason'][:100]}...")


if __name__ == "__main__":
    asyncio.run(main())
