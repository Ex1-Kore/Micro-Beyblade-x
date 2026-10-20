import { notFound } from 'next/navigation';
import { BookOpen } from 'lucide-react';
import { WikiLayout } from '../components';
import Markdown from '../markdown';
import { getPublishedArticleBySlug, WIKI_CATEGORY_LABELS, type WikiCategory } from '../../lib/wiki';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export default async function WikiArticlePage({ params }: Props) {
    const { slug } = await params;
    const article = await getPublishedArticleBySlug(slug);
    if (!article) notFound();

    const categoryLabel =
        WIKI_CATEGORY_LABELS[article.category as WikiCategory] ?? article.category;
    const updated = new Date(article.updatedAt).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <WikiLayout title={article.title} icon={<BookOpen className="w-4 h-4 text-cyan-400" />}>
            <article className="bg-[#121826] border border-slate-800 rounded-2xl p-6 md:p-8">
                <div className="mb-4 flex flex-wrap items-center gap-3 text-xs">
                    <span className="rounded-full bg-cyan-950/50 border border-cyan-800/50 text-cyan-300 px-3 py-1 font-bold">
                        {categoryLabel}
                    </span>
                    <span className="text-slate-500">อัปเดตล่าสุด {updated}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{article.title}</h1>
                {article.excerpt && <p className="text-slate-400 mb-6 leading-relaxed">{article.excerpt}</p>}
                {article.coverImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={article.coverImage}
                        alt={article.imageAlt || article.title}
                        className="rounded-2xl border border-slate-800 mb-6 w-full h-auto"
                    />
                )}
                <Markdown content={article.content} />
            </article>
        </WikiLayout>
    );
}
