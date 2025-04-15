import { PrimeReactProvider } from "primereact/api"
import Steps from "./components/Steps.tsx"
import { twMerge } from "tailwind-merge"

function App() {
    return (
        <div className="mx-auto max-w-md md:max-w-6xl mt-10">
            <PrimeReactProvider value={{ pt: {}, ptOptions: { mergeSections: true, mergeProps: true, classNameMergeFunction: twMerge } }}>
                <h1 className="text-3xl font-bold text-center">Discord Emoji & Sticker Downloader</h1>
                <Steps />
            </PrimeReactProvider>
        </div>
    )
}

export default App
