
import { useRef, useState } from "react"
import { Stepper } from "primereact/stepper"
import { StepperPanel } from "primereact/stepperpanel"
import { Button } from "primereact/button"

export default function Steps() {
    const stepperRef = useRef<Stepper>(null)
    const emojiPanelRef = useRef<Element>(null)
    const [server, setServer] = useState(null)

    return (
        <div className="card">
            <Stepper ref={stepperRef} style={{ flexBasis: "50rem" }} orientation="vertical">
                <StepperPanel header="Choose a server">
                    <div className="flex flex-column h-12rem">
                        <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">Content I</div>
                    </div>
                    <div className="flex py-4">
                        <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => { setServer(1); stepperRef.current!.nextCallback() }} />
                    </div>
                </StepperPanel>
                { server && [
                    <StepperPanel header="Pick from emojis" pt={{ root: { ref: emojiPanelRef } }}>
                        <div className="flex flex-column h-12rem">
                            <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">Content II</div>
                        </div>
                        <div className="flex py-4">
                            <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current!.prevCallback()} />
                            <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current!.nextCallback()} />
                        </div>
                    </StepperPanel>,
                    <StepperPanel header="Pick from stickers">
                        <div className="flex flex-column h-12rem">
                            <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">Content II</div>
                        </div>
                        <div className="flex py-4">
                            <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current!.prevCallback()} />
                            <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current!.nextCallback()} />
                        </div>
                    </StepperPanel>,
                    <StepperPanel header="Pick from soundboard">
                        <div className="flex flex-column h-12rem">
                            <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">Content II</div>
                        </div>
                        <div className="flex py-4">
                            <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current!.prevCallback()} />
                            <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current!.nextCallback()} />
                        </div>
                    </StepperPanel>,
                    <StepperPanel header="Download your files">
                        <div className="flex flex-column h-12rem">
                            <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">Content III</div>
                        </div>
                        <div className="flex py-4">
                            <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current!.prevCallback()} />
                        </div>
                    </StepperPanel>,
                ]}
            </Stepper>
        </div>
    )
}
