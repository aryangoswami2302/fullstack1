import React from 'react';
import ClassProps from './ClassProps'
import FunProps from './FunProps'

function MainProps() {
  return (
    <div>
        <div className="container">
            <h1 className="text-uppercase">Class props</h1>
            <div className="row">
                <ClassProps title={"car 1"} desc={"car 1 details"} img={"https://www.autocar.co.uk/sites/autocar.co.uk/files/images/car-reviews/first-drives/legacy/jag_gt_rendering_2023web.jpg"}/>
                <ClassProps title={"car 2"} desc={"car 2 details"} img={"https://www.motortrend.com/uploads/2021/10/2022-Lexus-IS-500-F-Sport-37.jpg"}/>
                <ClassProps title={"car 3"} desc={"car 3 details"} img={"https://www.creativefabrica.com/wp-content/uploads/2023/04/06/futuristic-sports-car-Modern-car-Graphics-66382336-1.jpeg"}/>
                <ClassProps title={"car 4"} desc={"car 4 details"} img={"https://tse1.mm.bing.net/th/id/OIP.xAB02OO7DOJSXOrh8Vq76QHaGJ?pid=Api&P=0&h=220"}/>
                <ClassProps title={"car 5"} desc={"car 5 details"} img={"https://www.slashgear.com/img/gallery/10-coolest-ferrari-concept-cars-ever-made/l-intro-1683307749.jpg"}/>
                <ClassProps title={"car 6"} desc={"car 6 details"} img={"https://images.squarespace-cdn.com/content/5c19f34131d4df5ce65dc0f2/1693703821778-2X48UYMZ9HKZGA9BO2HG/01+F2+2024+Car+%28C%29+Formula+Motorsport+Limited.jpg?format=1500w&content-type=image%2Fjpeg"}/>
            </div>
        </div>

        <div className="container">
            <h1 className="text-uppercase">function props</h1>
            <div className="row">
                <FunProps title={"car1"} desc={"car1 details"} img={"https://www.autocar.co.uk/sites/autocar.co.uk/files/images/car-reviews/first-drives/legacy/jag_gt_rendering_2023web.jpg"}/>
                <FunProps title={"car2"} desc={"car2 details"} img={"https://www.motortrend.com/uploads/2021/10/2022-Lexus-IS-500-F-Sport-37.jpg"}/>
                <FunProps title={"car3"} desc={"car3 details"} img={"https://www.creativefabrica.com/wp-content/uploads/2023/04/06/futuristic-sports-car-Modern-car-Graphics-66382336-1.jpeg"}/>
                <FunProps title={"car4"} desc={"car4 details"} img={"https://tse1.mm.bing.net/th/id/OIP.xAB02OO7DOJSXOrh8Vq76QHaGJ?pid=Api&P=0&h=220"}/>
                <FunProps title={"car5"} desc={"car5 details"} img={"https://www.slashgear.com/img/gallery/10-coolest-ferrari-concept-cars-ever-made/l-intro-1683307749.jpg"}/>
                <FunProps title={"car6"} desc={"car6 details"} img={"https://images.squarespace-cdn.com/content/5c19f34131d4df5ce65dc0f2/1693703821778-2X48UYMZ9HKZGA9BO2HG/01+F2+2024+Car+%28C%29+Formula+Motorsport+Limited.jpg?format=1500w&content-type=image%2Fjpeg"}/>
            </div>
        </div>
    </div>
  )
}

export default MainProps;