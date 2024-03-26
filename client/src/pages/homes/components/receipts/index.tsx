import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { Store } from "@/store";
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';

import './receipt.scss';

export default function Receipt() {
  const [display, setDisplay] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState<any>(null);
  const receiptStore = useSelector((store: Store) => store.receiptStore);

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Ho_Chi_Minh'
  }

  function convertToVND(num: number) {
    var vnd = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
    return vnd;
  }

  useEffect(() => {
    console.log('receiptStore.receipts', receiptStore.receipts);
  }, [receiptStore.receipts]);

  return (
    <div className='receipt_page'>
      <div className='title'>
        <h1>ORDERS</h1>
      </div>
      <MDBTable striped bordered hover align='middle'>
        <MDBTableHead>
          <tr>
            <th scope='col'>#</th>
            <th scope='col'>Order code</th>
            <th scope='col'>Orders</th>
            <th scope='col'>Payment methods</th>
            <th scope='col'>Status</th>
            <th scope='col'>Order Status</th>
            <th scope='col'>Time</th>
            <th scope='col'>Order Detail</th>
          </tr>
        </MDBTableHead>

        <MDBTableBody>
          {receiptStore.receipts?.map((receipt, index) => {
            if (receipt.status != "delete") {
              return (
                <tr key={Date.now() * Math.random()}>
                  <td>{index + 1}</td>
                  <td>#NHANTECH-PAY{receipt.id}</td>
                  <td>{convertToVND(receipt.total)}</td>
                  <td>{receipt.payMode == 'cash' ? 'Cash' : 'Zalo Pay'}</td>
                  <td>
                    <MDBBadge color={receipt.paid ? 'success' : 'danger'} pill>
                      {receipt.paid ? 'Paid' : 'Unpaid'}
                    </MDBBadge>
                  </td>

                  <td>
                    {
                      receipt.status != 'shopping' && (
                        <>
                          {receipt.status == 'pending' && (
                            <MDBBadge color='secondary' pill>
                              Pending ...
                            </MDBBadge>
                          )}
                          {receipt.status == 'accepted' && (
                            <MDBBadge color='secondary' pill>
                              Accepted <i className="fa-regular fa-circle-check"></i>
                            </MDBBadge>
                          )}
                          {receipt.status == 'shipping' && (
                            <MDBBadge color='secondary' pill>
                              Shipping ...
                            </MDBBadge>
                          )}
                          {receipt.status == 'done' && (
                            <MDBBadge color='success' pill>
                              Done
                            </MDBBadge>
                          )}
                        </>
                      )
                    }
                  </td>

                  <td>
                    {receipt.paidAt ? new Date(Number(receipt.paidAt)).toLocaleString('en-GB', options) : new Date(Number(receipt.pending)).toLocaleString('en-GB', options)}
                  </td>
                  <td>
                    <button className='btn btn-primary' onClick={() => {
                      setDisplay(true);
                      setCurrentReceipt(receipt.detail);
                    }}>Detail</button>
                  </td>
                </tr>
              );
            }
          })}
        </MDBTableBody>
      </MDBTable>

      {receiptStore.receipts.some(item => item.status == "delete") && (
        <>
          <div className='title'><h1 style={{ textTransform: 'uppercase' }}>Orders have been canceled.</h1></div>
          <MDBTable striped bordered hover align='middle'>
            <MDBTableHead>
              <tr>
                <th scope='col'>#</th>
                <th scope='col'>Order code</th>
                <th scope='col'>Orders</th>
                <th scope='col'>Payment methods</th>
                <th scope='col'>Status</th>
                <th scope='col'>Order Status</th>
                <th scope='col'>Time Cancel</th>
                <th scope='col'>Order Detail</th>
              </tr>
            </MDBTableHead>

            <MDBTableBody>
              {receiptStore.receipts?.map((receipt, index) => {
                if (receipt.status == "delete") {
                  return (
                    <tr key={Date.now() * Math.random()}>
                      <td>{index + 1}</td>
                      <td>#NHANTECH-{receipt.id}</td>
                      <td>{convertToVND(receipt.total)}</td>
                      <td>{receipt.payMode == 'cash' ? 'Cash' : 'Zalo Pay'}</td>
                      <td>
                        <MDBBadge color={receipt.paid ? 'success' : 'danger'} pill>
                          The order has been canceled.
                        </MDBBadge>
                      </td>
                      <td>
                        {new Date(Number(receipt.updateAt)).toLocaleString('en-GB', options)}
                      </td>
                      <td>
                        <button className='btn btn-primary' onClick={() => {
                          setDisplay(true);
                          setCurrentReceipt(receipt.detail);
                        }}>Detail</button>
                      </td>
                    </tr>
                  );
                }
              })}
            </MDBTableBody>
          </MDBTable>
        </>
      )}

      <Modal
        show={display}
        onHide={() => setDisplay(false)}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Order Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='item_container_title'>
            <p>Image</p>
            <p>Product name</p>
            <p>Price</p>
            <p>Quantity</p>
          </div>
          {currentReceipt?.map((item: any) => (
            <div className='item_container' key={Date.now() * Math.random()}>
              <img src={item?.product.avatar} alt={item?.product.name} />
              <p>{item.product.name}</p>
              <p>{convertToVND(item.product.price)}</p>
              <p>{item.quantity}</p>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setDisplay(false)}>OK</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
