'use client'
import React, { useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { PiCopyBold } from "react-icons/pi";
import { PiCheckCircleDuotone } from "react-icons/pi";


const CodeBlock = ({ className, children = [] }) => {
    const [copy, setcopy] = useState(false)


    const language = className ? className.replace('language-', '') : 'plaintext';
    const code = Array.isArray(children) ? children[0] : children || '';

    let highlightedCode;

    try {
        if (hljs.getLanguage(language)) {
            highlightedCode = hljs.highlight(language, code).value;
        } else {
            highlightedCode = hljs.highlightAuto(code).value;
        }
    } catch (error) {
        console.error('Highlight.js error:', error);
        highlightedCode = code;
    }
    const handleCopy = () => {
        setcopy(true);
        setTimeout(() => {
            setcopy(false);
        }, 2000);
    };

    return (
        <>
            <div className=' w-full h-full flex flex-col relative gap-2 border-gray-800 border-2 '>
                <div className=" h-8 w-full bg-gray-800  p-5 flex justify-between items-center">
                    <div className='text-slate-200 '>{language}</div>
                    <CopyToClipboard text={code} className="sticky flex justify-center items-center gap-1 text-slate-200 cursor-pointer hover:text-slate-100" onCopy={handleCopy}>
                        {!copy ? <div><PiCopyBold size={15} /><span>Copy</span><span>code</span></div> : <div><PiCheckCircleDuotone size={20} /><span>Coppied</span></div>}
                    </CopyToClipboard>

                </div>
                <div>
                    <div className="relative m-0 p-4">
                        <div>
                            <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default CodeBlock




