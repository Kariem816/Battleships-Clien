import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export default function useQueryParams() {
    const { search } = useLocation();

    const query = useMemo(() => new URLSearchParams(search), [search]);

    const searchParams = {};

    for (const [key, value] of query) {
        searchParams[key] = value;
    }

    return searchParams;
}