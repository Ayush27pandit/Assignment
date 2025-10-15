import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { OverlayPanel } from "primereact/overlaypanel";

interface OverlayProps {
  inputValue: number;
  setInputValue: (value: number) => void;
  opRef: React.RefObject<OverlayPanel | null>;
  totalRecords: number;
  handleSubmit: () => void;
  handleClear: () => void;
}
function Overlay({
  inputValue,
  setInputValue,
  opRef,
  totalRecords,
  handleSubmit,
  handleClear,
}: OverlayProps) {
  return (
    <OverlayPanel ref={opRef} className="my-6">
      <div className="overlay-content flex flex-column justify-content-between my-6 ">
        <h4 className="overlay-label">Enter number of Rows to be selected</h4>
        <InputNumber
          className="overlay-input"
          value={inputValue}
          onValueChange={(e) => setInputValue(e.value ?? 0)}
          min={0}
          max={totalRecords}
        />

        <p> </p>
        <Button label="Select" onClick={handleSubmit} />
        <span> </span>
        <Button label="Clear" severity="danger" onClick={handleClear} />
      </div>
    </OverlayPanel>
  );
}

export default Overlay;
