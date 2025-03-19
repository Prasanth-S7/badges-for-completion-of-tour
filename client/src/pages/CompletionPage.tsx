import { useState } from "react"
import InfiniteJsonMarquee from "../components/InfiniteJsonMarquee"
import { toast } from "sonner"
import { BACKEND_URL } from "../config/config"

export default function CompletionPage() {
    console.log(BACKEND_URL)
    const [formData, setState] = useState({
        name: "",
        email: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setState((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.email === "" || formData.name === "") {
            toast.error("Please fill all the fields")
            return
        }
        const response = await fetch(`${BACKEND_URL}/submitcertificate`, {
            body: JSON.stringify({
                name: formData.name,
                email: formData.email,
            }),
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
        })
        const data = await response.json();
        if(response.status === 400 || response.status === 500){
            toast.error(data.msg)
            return;
        }
        if(response.status === 200){
            toast.success(data.msg + " You will receive the badge in next 30 minutes")
        }
    }

    return (
        <div className="relative min-h-screen w-full bg-[#0a0a0a] font-satoshi">
            <div className="absolute inset-0 
                [background-size:40px_40px]
                [background-image:linear-gradient(to_right,rgba(228,228,231,3.0)_1px,transparent_1px),linear-gradient(to_bottom,rgba(228,228,231,3.0)_1px,transparent_1px)]
                dark:[background-image:linear-gradient(to_right,rgba(38,38,38,1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(38,38,38,1)_1px,transparent_1px)]">
            </div>

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#0a0a0a]/90 [mask-image:radial-gradient(ellipse_50%_70%_at_top_left,transparent_6%,black)]"></div>
            <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center p-4">
                <div className="flex w-full max-w-7xl flex-col gap-6 md:flex-row md:gap-8 lg:gap-10">
                    <div className="w-full overflow-hidden border border-white/20 bg-[#111111]/70 md:w-1/2">
                        <div className="relative h-full w-full min-h-[250px] md:min-h-[400px]">
                            <InfiniteJsonMarquee />
                        </div>
                    </div>

                    <div className="w-full border border-white/20 bg-[#111111]/70 p-6 backdrop-blur-sm md:w-1/2 md:p-8">
                        <h4 className="mb-2 text-center text-xl font-semibold text-white md:text-2xl">
                            Congrats for successfully completing the Tour!
                        </h4>
                        <p className="mb-6 text-center text-white/80">We celebrate your achievement by giving you a badge.</p>
                        <p className="mb-4 text-white/90">Please enter the below details</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Name"
                                    className="w-full border border-white/20 bg-white/5 p-3 transition-all focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
                                />
                            </div>

                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    className="w-full border border-white/20 bg-white/5 p-3 transition-all focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full cursor-pointer bg-[#5dfd8a] p-3 text-black font-semibold shadow-lg transition-all duration-200 focus:ring-2"
                            >Generate Badge
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}