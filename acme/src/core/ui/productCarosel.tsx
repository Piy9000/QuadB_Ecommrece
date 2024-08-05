import { FC } from "react";
import { IProduct } from "../model/interfaces";

type ProductCaroselProps = {
    data: IProduct[];
};

const ProductCarosel: FC<ProductCaroselProps> = ({ data }) => {
    return <>
        <div className="carousel carousel-center bg-base-100 rounded-box max-w-full space-x-4 p-4">
            {
                data && data.map((item, idx) => <div key={item.productName + '_' + idx} className="carousel-item ">
                    <div className="relative">
                        <img src={item.displayImgUrl} alt="productimage" className="w-full absolute top-0 left-0" />
                        <div className="rating">
                            <input type="radio" name="rating-1" className="mask mask-star" />
                            <input type="radio" name="rating-1" className="mask mask-star" defaultChecked />
                            <input type="radio" name="rating-1" className="mask mask-star" />
                            <input type="radio" name="rating-1" className="mask mask-star" />
                            <input type="radio" name="rating-1" className="mask mask-star" />
                        </div>
                        <p className="text-sm font-semibold">{item.productName}</p>
                        <p className="text-[12px]">${item.price}</p>
                    </div>
                </div>)
            }
        </div>
    </>;
};

export default ProductCarosel;