$(document).ready(function () {

    // Reset active form
    $('form:visible')[0].reset();

    // Booking form submission
    $('#bookingForm').on('submit', function (event) {
      event.preventDefault();
  
      const checkinDate = $('#checkinDate').val();
      const checkoutDate = $('#checkoutDate').val();
      const guests = $('#guests').val();
      const roomType = $('#roomType').val();

      if (new Date(checkinDate) >= new Date(checkoutDate)) {
        alert('Check-in date must be before check-out date');
        return;
      }
  
      $.ajax({
        url: '/booking',
        method: 'POST',
        data: {
          checkinDate,
          checkoutDate,
          guests,
          roomType,
        },
        success: function (response) {
          if (response.success) {
            alert('Booking successful! Booking ID: ' + response.bookingId);
            $('#bookingForm')[0].reset();
          } else {
            alert('Error: ' + response.error);
          }
        },
      });
    }); 
  
    // Contact us form submission
    $('#contactUsForm').on('submit', function (event) {

      event.preventDefault();
  
      const name = $('#name').val();
      const email = $('#email').val();
      const phone = $('#phone').val();
      const message = $('#message').val();
  
      $.ajax({
        url: '/contactus',
        method: 'POST',
        data: {
          name,
          email,
          phone,
          message,
        },
        success: function (response) {
          if (response.success) {
            alert('Message sent successfully! Contact ID: ' + response.contactId);
            $('#contactUsForm')[0].reset();
          } else {
            alert('Error: ' + response.error);
          }
        },
      });
    });
  });