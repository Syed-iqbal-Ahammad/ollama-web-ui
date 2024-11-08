import React from 'react'
import Image from 'next/image';
//libraries
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CodeBlock from "./CodeBlock";

const MarkDown = ({ content,children }) => {
    return (
        <div className="markdown-container text-foreground">
            <Markdown
                className=" md:text-base text-xs prose text-foreground "
                remarkPlugins={[remarkGfm]}
                components={{
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <CodeBlock className={className}>{children}</CodeBlock>
                        ) : (
                            <code className={className} {...props}>
                                <div className=" p-4 text-foreground">{children}</div>
                            </code>
                        );
                    },

                    h1: ({ children }) => <h1 className="text-foreground">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-foreground">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-foreground">{children}</h3>,
                    h4: ({ children }) => <h4 className="text-foreground">{children}</h4>,
                    h5: ({ children }) => <h5 className="text-foreground">{children}</h5>,
                    h6: ({ children }) => <h6 className="text-foreground">{children}</h6>,
                    p: ({ children }) => <p className="text-foreground">{children}</p>,
                    a: ({ children, href }) => <a className="text-foreground hover:underline" href={href}>{children}</a>,
                    li: ({ children }) => <li className="text-foreground">{children}</li>,
                    blockquote: ({ children }) => <blockquote className="text-foreground">{children}</blockquote>,
                    ul: ({ children }) => <ul className="text-foreground">{children}</ul>,
                    ol: ({ children }) => <ol className="text-foreground">{children}</ol>,
                    em: ({ children }) => <em className="text-foreground">{children}</em>,
                    del: ({ children }) => <del className="text-foreground">{children}</del>,
                    table: ({ children }) => <table className="text-foreground border border-foreground rounded-full border-collapse">{children}</table>,
                    thead: ({ children }) => <thead className="text-foreground bg-secondary border border-foreground rounded-full border-collapse ">{children}</thead>,
                    tbody: ({ children }) => <tbody className="text-foreground">{children}</tbody>,
                    th: ({ children }) => <th className="text-foreground border border-foreground  border-collapse p-3 ">{children}</th>,
                    td: ({ children }) => <td className="text-foreground border border-foreground  border-collapse  p-3 ">{children}</td>,
                    tr: ({ children }) => <tr className="text-foreground border border-foreground border-collapse ">{children}</tr>,

                    img: ({ src, alt }) => <Image className="text-foreground"  height={30} width={30}  src={src} alt={alt} />,
                    hr: () => <hr className="text-foreground" />,
                    br: () => <br className="text-foreground" />,
                    strong: ({ children }) => <strong className="text-foreground">{children}</strong>


                }}
            >
                {content}
            </Markdown>
        </div>
    )
}

export default MarkDown
