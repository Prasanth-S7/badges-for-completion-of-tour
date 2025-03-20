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
    const [showDialog, setShowDialog] = useState(false)
    const [dialogMessage, setDialogMessage] = useState("")
    const [dialogType, setDialogType] = useState("success")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setState((prev) => ({ ...prev, [name]: value }))
    }

    const resetForm = () => {
        setState({
            name: "",
            email: "",
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.email === "" || formData.name === "") {
            toast.error("Please fill all the fields")
            return
        }
        
        try {
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
                setDialogMessage(data.msg)
                setDialogType("error")
                setShowDialog(true)
                return;
            }
            
            if(response.status === 200){
                const successMessage = data.msg + ". You will receive the badge in next 30 minutes"
                toast.success(successMessage)
                setDialogMessage(successMessage)
                setDialogType("success")
                setShowDialog(true)
                resetForm() 
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.")
            setDialogMessage("An error occurred. Please try again.")
            setDialogType("error")
            setShowDialog(true)
        }
    }

    const closeDialog = () => {
        setShowDialog(false)
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

            {showDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-11/12 max-w-md border border-white/20 bg-[#111111] p-6 shadow-xl">
                        <div className="mb-4 flex items-center">
                            <span className={`mr-2 text-2xl ${dialogType === "success" ? "text-[#5dfd8a]" : "text-red-500"}`}>
                                {dialogType === "success" ? "✓" : "✕"}
                            </span>
                            <h3 className="text-xl font-medium text-white">
                                {dialogType === "success" ? "Success" : "Error"}
                            </h3>
                        </div>
                        <p className="mb-6 text-white/80">{dialogMessage}</p>
                        <div className="flex justify-end">
                            <button
                                onClick={closeDialog}
                                className="cursor-pointer bg-white/10 px-4 py-2 text-white hover:bg-white/20"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}