interface Coordinate {
    latitude: number | null;
    longitude: number | null;
}

interface InfoWindowData {
    position: {
        latitude: number;
        longitude: number;
    };
    name: string;
    img: string;
    rating: number;
    openNow?: boolean;
}