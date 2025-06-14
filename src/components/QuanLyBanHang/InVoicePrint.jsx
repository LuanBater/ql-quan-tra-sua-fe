import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const InvoicePrint = ({ orderList, OutputDate, user, totalPrice, paymentUrl }) => {
  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h1>Hóa đơn</h1>
      <p style={{ fontSize: '26px', fontWeight: 'bold' }}>Cửa hàng trà sữa Bater</p>
      <p style={{ fontSize: '16px' }}>Địa chỉ: 97 Man Thiện, P. Hiệp Phú, TP. Thủ Đức</p>
      <p style={{ fontSize: '16px' }}>Hotline: 0987654321</p>            
      <p style={{ textAlign: 'left' }}><strong>Ngày xuất:</strong> {OutputDate}</p>
      <p style={{ textAlign: 'left' }}><strong>Khách Hàng:</strong> Khách lẻ</p>
      <p style={{ textAlign: 'left' }}><strong>Nhân viên bán:</strong> {user}</p>

      <table style={{ width: '550px', margin: '0 auto', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th rowSpan="2">Sản phẩm</th>
            <th rowSpan="2">Đơn giá</th>
            <th rowSpan="2">SL</th>
            <th colSpan="2">Topping</th>
          </tr>
          <tr>
            <th>Tên</th>
            <th>Đơn giá</th>
          </tr>
        </thead>
        <tbody>
          {orderList.map((item, index) => {
            const rowspan = item.listTopping.length || 1; // Số hàng cần merge
            return (
              <React.Fragment key={index}>
                <tr>
                  <td rowSpan={rowspan}>{item.tensp} - {item.size}</td>
                  <td rowSpan={rowspan}>{item.gia.toLocaleString('vi-VN')}đ</td>
                  <td rowSpan={rowspan}>{item.soluong}</td>
                  {item.listTopping.length > 0 ? (
                    <>
                      <td>{item.listTopping[0].tensp}</td>
                      <td>{item.listTopping[0].gia.toLocaleString('vi-VN')}đ</td>
                    </>
                  ) : (
                    <td colSpan="2">Không có topping</td>
                  )}
                </tr>

                {item.listTopping.slice(1).map((topping, toppingIndex) => (
                  <tr key={toppingIndex}>
                    <td>{topping.tensp}</td>
                    <td>{topping.gia.toLocaleString('vi-VN')}đ</td>
                  </tr>
                ))}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      <p style={{ textAlign: 'right' }}><strong>Tổng giá:</strong> {totalPrice.toLocaleString('vi-VN')}đ</p>

      {/* QR Code */}
      {paymentUrl && (
        <div style={{ position: 'relative', textAlign: 'center', margin: 'auto' }}>
          <QRCodeCanvas
            value={paymentUrl}
            size={200}
            style={{ display: 'block', margin: 'auto' }}
          />
        </div>
      )}
    </div>
  );
};

export default InvoicePrint;
