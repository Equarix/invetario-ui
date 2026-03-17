import { Route, Routes } from "react-router";
import Proforma from "@/pages/sale/proformas/Proforma";
import CreateProforma from "@/pages/sale/proformas/create/CreateProforma";

export function ProformaRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Proforma />} />
            <Route path="/crear" element={<CreateProforma />} />
        </Routes>
    )
}