import { BrowserRouter, Routes, Route } from "react-router-dom"
import CompletionPage from "./pages/CompletionPage"
import { Toaster } from "sonner"
export default function App() {
  return (
    <div>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CompletionPage />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

