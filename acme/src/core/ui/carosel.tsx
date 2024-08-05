import { FC } from "react";
import { Carosel } from "../model/props";

type CaroselProps = {
    data: ReadonlyArray<Carosel>;
};

const CaroselComp: FC<CaroselProps> = ({ data }) => {
    return <>
        <div className="carousel w-full h-[calc(100vh-175px)]">
            {
                data && data.map((item, idx) => <div key={idx + '_' + item.id} id={item.id} className="carousel-item relative w-full">
                    <img
                        src={item.imageURL}
                        className="w-full" alt="products" />
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                        <a href={`#${item.id}`} className="btn btn-circle">❮</a>
                        <a href={`#${item.id}`} className="btn btn-circle">❯</a>
                    </div>
                </div>)
            }
        </div>
    </>;
};
export default CaroselComp;