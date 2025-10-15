import React, { useState, useEffect, useRef, Suspense } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import type { FieldData, PageChangeEvent } from "../utils/types";
import "primeicons/primeicons.css";
import { OverlayPanel } from "primereact/overlaypanel";
const Overlay = React.lazy(() => import("../components/Overlay"));

const apiUrl = import.meta.env.VITE_API_URL as string;

export default function Fetchdata() {
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedRows, setSelectedRows] = useState<FieldData[]>([]);
  const [inputValue, setInputValue] = useState(0);
  const [rowData, setRowData] = useState<FieldData[]>([]);
  const [totalToSelect, setTotalToSelect] = useState(0);

  const op = useRef<OverlayPanel>(null);

  /*PrimeReact doesnt provide page number directly on clicking, it provide first and rows values where 
  where first means index of first row of current page (eg : 1st page firstrow's First=0) and rows tell how many records are there in current page 
  */
  const pageNumber = Math.floor(first / rows) + 1;

  //loading saved selected rows on mount
  useEffect(() => {
    const saved = localStorage.getItem("selectedRows");
    if (saved) setSelectedRows(JSON.parse(saved));
  }, []);

  //for fetching row number
  useEffect(() => {
    fetchRows(pageNumber);
  }, [pageNumber, totalToSelect]);

  useEffect(() => {
    localStorage.setItem("selectedRows", JSON.stringify(selectedRows));
  }, [selectedRows]);

  const onSelectionChange = (e: { value: FieldData[] }) => {
    const currentPageIds = rowData.map((r) => r.id);

    const newGlobalSelection = selectedRows.filter(
      (r) => !currentPageIds.includes(r.id)
    );

    // Add the new selection from this page
    setSelectedRows([...newGlobalSelection, ...e.value]);
  };
  async function fetchRows(page: number) {
    try {
      const res = await axios.get(apiUrl, {
        params: { page },
        headers: { "Cache-Control": "no-cache" },
      });
      const offlimit = res.data.pagination.limit;
      const data = res.data.data.map((item: FieldData) => ({
        id: item.id,
        title: item.title,
        place_of_origin: item.place_of_origin,
        artist_display: item.artist_display,
        inscriptions: item.inscriptions,
        date_start: item.date_start,
        date_end: item.date_end,
      }));
      setRows(offlimit);
      setTotalRecords(res.data.pagination.total);
      setRowData(data);

      //logic for selecting additional unselected rows from the current page until reaching the user-input number
      const alreadySelectedIds = new Set(selectedRows.map((r) => r.id));
      let remaining = totalToSelect - selectedRows.length;

      const pageSelection: FieldData[] = [];
      for (const row of data) {
        if (remaining <= 0) break;
        if (!alreadySelectedIds.has(row.id)) {
          pageSelection.push(row);
          remaining--;
        }
      }

      if (pageSelection.length > 0) {
        setSelectedRows((prev) => [...prev, ...pageSelection]);
      }
    } catch (error) {
      console.error("Error in fetching rows", error);
    }
  }

  const onPageChange = (event: PageChangeEvent) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const handleSubmit = () => {
    setTotalToSelect(inputValue);
    op.current?.hide();
  };

  const handleClear = () => {
    setSelectedRows([]);
    setInputValue(0);
    setTotalToSelect(0);
    localStorage.removeItem("selectedRows");
    op.current?.hide();
  };

  return (
    <div>
      <h1>React Assignment</h1>
      <DataTable
        lazy
        showGridlines
        paginator
        rows={rows} //offlimit is 12 in api
        first={first}
        totalRecords={totalRecords}
        onPage={onPageChange}
        size="large"
        stripedRows
        value={rowData}
        selectionMode={"multiple"}
        selection={selectedRows.filter((r) =>
          rowData.some((d) => d.id === r.id)
        )}
        onSelectionChange={onSelectionChange}
        dataKey="id"
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "5rem" }}
        ></Column>

        <Column
          field="title"
          header={
            <div className="header-content">
              <div>
                <a
                  className="header-icon"
                  href="#"
                  onClick={(e) => op.current && op.current.toggle(e)}
                >
                  <i className="pi pi-chevron-down"></i>
                </a>
                <span className="header-text">Title</span>
              </div>
              <Suspense fallback={<div>Loading...</div>}>
                <Overlay
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  totalRecords={totalRecords}
                  handleSubmit={handleSubmit}
                  handleClear={handleClear}
                  opRef={op}
                />
              </Suspense>
            </div>
          }
        />
        <Column field="artist_display" header="Artist" />
        <Column field="place_of_origin" header="Origin" />
        <Column field="inscriptions" header="Inscriptions" />
        <Column
          header="Date"
          body={(data) =>
            data.date_start || data.date_end
              ? `${data.date_start ?? ""} - ${data.date_end ?? ""}`
              : ""
          }
        />
      </DataTable>
    </div>
  );
}
