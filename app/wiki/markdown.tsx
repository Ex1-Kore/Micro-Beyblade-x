import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

/**
 * ตัว render Markdown ของบทความ wiki (server component)
 * จัด style เอง而非ใช้ typography plugin เพื่อให้เข้ากับธีมมืดของเว็บ
 */
const components: Components = {
    h1: ({ children }) => <h1 className="text-3xl font-black text-white mt-8 mb-4">{children}</h1>,
    h2: ({ children }) => (
        <h2 className="text-2xl font-black text-white mt-10 mb-4 pb-2 border-b border-slate-800">{children}</h2>
    ),
    h3: ({ children }) => <h3 className="text-lg font-bold text-cyan-300 mt-6 mb-3">{children}</h3>,
    h4: ({ children }) => <h4 className="text-base font-bold text-white mt-5 mb-2">{children}</h4>,
    p: ({ children }) => <p className="text-sm leading-relaxed text-slate-300 my-3">{children}</p>,
    a: ({ href, children }) => {
        const external = typeof href === 'string' && /^https?:\/\//.test(href);
        return (
            <a
                href={href}
                className="text-cyan-400 underline decoration-cyan-500/40 hover:text-cyan-300"
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
                {children}
            </a>
        );
    },
    ul: ({ children }) => <ul className="list-disc pl-6 my-3 space-y-1 text-sm text-slate-300">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-6 my-3 space-y-1 text-sm text-slate-300">{children}</ol>,
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-cyan-500/50 bg-slate-900/60 px-4 py-2 my-4 rounded-r-lg text-slate-300 text-sm">
            {children}
        </blockquote>
    ),
    pre: ({ children }) => (
        <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 my-4 overflow-x-auto text-sm font-mono text-sky-300">
            {children}
        </pre>
    ),
    code: ({ className, children }) => {
        const isFenced = /language-/.test(className || '');
        if (isFenced) return <code className={className}>{children}</code>;
        return (
            <code className="bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded text-[0.85em] font-mono">
                {children}
            </code>
        );
    },
    table: ({ children }) => (
        <div className="overflow-x-auto rounded-xl border border-slate-800 my-4">
            <table className="w-full text-sm">{children}</table>
        </div>
    ),
    thead: ({ children }) => <thead className="bg-slate-800">{children}</thead>,
    tr: ({ children }) => <tr className="border-t border-slate-800">{children}</tr>,
    th: ({ children }) => <th className="px-3 py-2 text-left text-slate-300 font-bold">{children}</th>,
    td: ({ children }) => <td className="px-3 py-2 text-slate-400">{children}</td>,
    hr: () => <hr className="border-slate-800 my-6" />,
    strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
    img: ({ src, alt }) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={typeof src === 'string' ? src : ''}
            alt={alt ?? ''}
            className="rounded-xl border border-slate-800 my-4 max-w-full h-auto"
        />
    ),
};

export default function Markdown({ content }: { content: string }) {
    return <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>{content}</ReactMarkdown>;
}
