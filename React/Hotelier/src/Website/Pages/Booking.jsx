import React from 'react'
import Header from '../Commen/Header'
import Footer from '../Commen/Footer'

function Booking() {
  return (
    <div>
      <div className="container-xxl bg-white p-0">
        <Header />
        {/* Page Header Start */}
        <div className="container-fluid page-header mb-5 p-0" style={{ backgroundImage: 'url(img/carousel-1.jpg)' }}>
          <div className="container-fluid page-header-inner py-5">
            <div className="container text-center pb-5">
              <h1 className="display-3 text-white mb-3 animated slideInDown">Booking</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center text-uppercase">
                  <li className="breadcrumb-item"><a href="#">Home</a></li>
                  <li className="breadcrumb-item"><a href="#">Pages</a></li>
                  <li className="breadcrumb-item text-white active" aria-current="page">Booking</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
        {/* Page Header End */}
        {/* Booking Start */}
        <div className="container-fluid booking pb-5 wow fadeIn" data-wow-delay="0.1s">
          <div className="container">
            <div className="bg-white shadow" style={{ padding: 35 }}>
              <div className="row g-2">
                <div className="col-md-10">
                  <div className="row g-2">
                    <div className="col-md-3">
                      <div className="date" id="date1" data-target-input="nearest">
                        <input type="text" className="form-control datetimepicker-input" placeholder="Check in" data-target="#date1" data-toggle="datetimepicker" />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="date" id="date2" data-target-input="nearest">
                        <input type="text" className="form-control datetimepicker-input" placeholder="Check out" data-target="#date2" data-toggle="datetimepicker" />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <select className="form-select">
                        <option selected>Adult</option>
                        <option value={1}>Adult 1</option>
                        <option value={2}>Adult 2</option>
                        <option value={3}>Adult 3</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <select className="form-select">
                        <option selected>Child</option>
                        <option value={1}>Child 1</option>
                        <option value={2}>Child 2</option>
                        <option value={3}>Child 3</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-md-2">
                  <button className="btn btn-primary w-100">Submit</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Booking End */}
        {/* Booking Start */}
        <div className="container-xxl py-5">
          <div className="container">
            <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
              <h6 className="section-title text-center text-primary text-uppercase">Room Booking</h6>
              <h1 className="mb-5">Book A <span className="text-primary text-uppercase">Luxury Room</span></h1>
            </div>
            <div className="row g-5">
              <div className="col-lg-6">
                <div className="row g-3">
                  <div className="col-6 text-end">
                    <img className="img-fluid rounded w-75 wow zoomIn" data-wow-delay="0.1s" src="img/about-1.jpg" style={{ marginTop: '25%' }} />
                  </div>
                  <div className="col-6 text-start">
                    <img className="img-fluid rounded w-100 wow zoomIn" data-wow-delay="0.3s" src="img/about-2.jpg" />
                  </div>
                  <div className="col-6 text-end">
                    <img className="img-fluid rounded w-50 wow zoomIn" data-wow-delay="0.5s" src="img/about-3.jpg" />
                  </div>
                  <div className="col-6 text-start">
                    <img className="img-fluid rounded w-75 wow zoomIn" data-wow-delay="0.7s" src="img/about-4.jpg" />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="wow fadeInUp" data-wow-delay="0.2s">
                  <form>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input type="text" className="form-control" id="name" placeholder="Your Name" />
                          <label htmlFor="name">Your Name</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input type="email" className="form-control" id="email" placeholder="Your Email" />
                          <label htmlFor="email">Your Email</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-floating date" id="date3" data-target-input="nearest">
                          <input type="text" className="form-control datetimepicker-input" id="checkin" placeholder="Check In" data-target="#date3" data-toggle="datetimepicker" />
                          <label htmlFor="checkin">Check In</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-floating date" id="date4" data-target-input="nearest">
                          <input type="text" className="form-control datetimepicker-input" id="checkout" placeholder="Check Out" data-target="#date4" data-toggle="datetimepicker" />
                          <label htmlFor="checkout">Check Out</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-floating">
                          <select className="form-select" id="select1">
                            <option value={1}>Adult 1</option>
                            <option value={2}>Adult 2</option>
                            <option value={3}>Adult 3</option>
                          </select>
                          <label htmlFor="select1">Select Adult</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-floating">
                          <select className="form-select" id="select2">
                            <option value={1}>Child 1</option>
                            <option value={2}>Child 2</option>
                            <option value={3}>Child 3</option>
                          </select>
                          <label htmlFor="select2">Select Child</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-floating">
                          <select className="form-select" id="select3">
                            <option value={1}>Room 1</option>
                            <option value={2}>Room 2</option>
                            <option value={3}>Room 3</option>
                          </select>
                          <label htmlFor="select3">Select A Room</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-floating">
                          <textarea className="form-control" placeholder="Special Request" id="message" style={{ height: 100 }} defaultValue={""} />
                          <label htmlFor="message">Special Request</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <button className="btn btn-primary w-100 py-3" type="submit">Book Now</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Booking End */}
        {/* Newsletter Start */}
        <div className="container newsletter mt-5 wow fadeIn" data-wow-delay="0.1s">
          <div className="row justify-content-center">
            <div className="col-lg-10 border rounded p-1">
              <div className="border rounded text-center p-1">
                <div className="bg-white rounded text-center p-5">
                  <h4 className="mb-4">Subscribe Our <span className="text-primary text-uppercase">Newsletter</span></h4>
                  <div className="position-relative mx-auto" style={{ maxWidth: 400 }}>
                    <input className="form-control w-100 py-3 ps-4 pe-5" type="text" placeholder="Enter your email" />
                    <button type="button" className="btn btn-primary py-2 px-3 position-absolute top-0 end-0 mt-2 me-2">Submit</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Newsletter Start */}
        {/* Back to Top */}
        <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top"><i className="bi bi-arrow-up" /></a>
      </div>
      <Footer />
    </div>

  )
}

export default Booking