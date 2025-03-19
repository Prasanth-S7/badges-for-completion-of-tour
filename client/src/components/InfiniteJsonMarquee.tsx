import React, { useState, useEffect } from 'react';

const InfiniteJsonMarquee = () => {
    const generateRandomJson = () => {
        const templates = [
            {
                type: "object",
                properties: {
                    name: { type: "string" },
                    age: { type: "number", minimum: 18, maximum: 65 },
                    email: { type: "string", format: "email" },
                    isActive: { type: "boolean" }
                }
            },
            {
                type: "object",
                properties: {
                    productId: { type: "string" },
                    price: { type: "number" },
                    inStock: { type: "boolean" },
                    categories: { type: "array", items: { type: "string" } }
                }
            },
            {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    title: { type: "string" },
                    completed: { type: "boolean" },
                    priority: { enum: ["low", "medium", "high"] }
                }
            },
            {
                type: "object",
                properties: {
                    name: { type: "string" },
                    age: { const: 25 },
                    companyName: { const: "MyCompany" }
                }
            }
        ];

        return JSON.stringify(templates[Math.floor(Math.random() * templates.length)], null, 2);
    };

    const [jsonData, setJsonData] = useState([]);

    useEffect(() => {
        const data = Array(10).fill().map(() => generateRandomJson());
        setJsonData(data);
    }, []);

    return (
        <div className="absolute inset-0 flex justify-center bg-black/40 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
                {jsonData.map((json, index) => (
                    <pre key={index} className="text-white/70 my-4 text-sm font-doto">
                        {json}
                    </pre>
                ))}
                {/* Duplicate the content to create seamless loop */}
                {jsonData.map((json, index) => (
                    <pre key={`duplicate-${index}`} className="text-white/70 my-4 text-sm font-doto">
                        {json}
                    </pre>
                ))}
            </div>
        </div>
    );
};

const style = document.createElement('style');
style.textContent = `
  @keyframes marquee {
    0% { transform: translateY(0); }
    100% { transform: translateY(-50%); }
  }
  
  .animate-marquee {
    animation: marquee 30s linear infinite;
  }
`;
document.head.appendChild(style);

export default InfiniteJsonMarquee;