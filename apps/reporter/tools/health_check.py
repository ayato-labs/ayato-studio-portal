import asyncio
from datetime import UTC, datetime, timedelta

from config import settings
from core.storage.supabase_storage import SupabaseStorage


async def main():
    db = SupabaseStorage(settings.SUPABASE_URL, settings.SUPABASE_KEY)

    dates = [
        (datetime.now(UTC)).strftime("%Y-%m-%d"),
        (datetime.now(UTC) - timedelta(days=1)).strftime("%Y-%m-%d"),
        (datetime.now(UTC) - timedelta(days=2)).strftime("%Y-%m-%d"),
    ]

    print("--- Supabase Health Check ---")
    for d in dates:
        r_resp = await db._request(
            "GET", "generated_reports", params={"select": "count", "generated_at": f"gte.{d}"}
        )
        r_count = r_resp.json()[0]["count"]

        s_resp = await db._request(
            "GET", "ai_scores", params={"select": "count", "scored_at": f"gte.{d}"}
        )
        s_count = s_resp.json()[0]["count"]

        rw_resp = await db._request(
            "GET", "raw_items", params={"select": "count", "fetched_at": f"gte.{d}"}
        )
        rw_count = rw_resp.json()[0]["count"]

        print(f"Date: {d}")
        print(f"  Raw Items: {rw_count}")
        print(f"  AI Scores: {s_count}")
        print(f"  Reports:   {r_count}")
        print("-" * 20)


if __name__ == "__main__":
    asyncio.run(main())
