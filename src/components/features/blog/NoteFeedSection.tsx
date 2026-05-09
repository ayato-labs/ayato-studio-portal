import { fetchNoteArticles } from "@/lib/note"
import { NoteCard } from "./NoteCard"
import { ChevronRight } from "lucide-react"

export async function NoteFeedSection() {
  const articles = await fetchNoteArticles(3)

  if (articles.length === 0) return null

  return (
    <section className="py-12 space-y-8">
      <div className="flex items-end justify-between px-2">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tighter sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-amber-500">
            Premium Engineering Assets
          </h2>
          <p className="text-muted-foreground text-sm font-medium">
            AI自律開発を実現する、Ayato Studio の心臓部（コアエンジン）実装技術
          </p>
        </div>
        <a 
          href="https://note.com/ayato_studio" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group hidden sm:flex items-center gap-1 text-sm font-bold text-amber-500/80 hover:text-amber-400 transition-colors"
        >
          View all on note
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <NoteCard key={article.link} article={article} />
        ))}
      </div>

      <div className="flex sm:hidden justify-center pt-4">
        <a 
          href="https://note.com/ayato_studio" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm font-bold text-amber-500"
        >
          View all on note
          <ChevronRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  )
}
