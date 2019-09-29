document.addEventListener('DOMContentLoaded', function () {
  var calendarEl = document.getElementById('calendar');


  function uuidv4() {
      return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
  }


  function  infoAndDelete(arg){

         /*get scroll position*/
         var eTop = $('body').offset().top;
         var scrollPosition= -1*(eTop - $(window).scrollTop())

        $(".customBackground").css("width", $(document).width());
        $(".customBackground").css("height", $(document).height());
        $(".customBackground").fadeIn("slow");
        $("#customInfoDeleteBox").fadeIn("slow");
         $("#customInfoDeleteBox").css("top",scrollPosition.toString()+"px");
        var id = arg.event.id;
        var title = arg.event.title;
        var start = arg.event.start;
        var end = arg.event.end;
        var allDay = arg.event.allDay;

        var dayLong;
        if(allDay==true){
            dayLong = "Yes";
         } else {
            dayLong = "No";
         }


        $("#customInfoDeleteBoxTitle").html(title);
        $("#customInfoDeleteBoxStart").html(start);
        $("#customInfoDeleteBoxEnd").html(end);
        $("#customInfoDeleteBoxAllDay").html(dayLong);

        /*if clicked on close button*/
        $("#customInfoDeleteBoxClose").click(e => {
          $(".customBackground").fadeOut("slow");
          $("#customInfoDeleteBox").fadeOut("slow");
        });

        /*if clicked on delete button*/

        $("#customInfoDeleteBoxDelete").click(e => {

            var dt = '{"id":"'+id+'"}'

          $.ajax({
            url: "/calender/deleteEvent",
            contentType: "application/json",
            method: "POST",
            data: dt,
            headers: {
              'Csrf-Token': $("input[name='csrfToken']").val()
            }
          }).done(function (data) {

            if (JSON.stringify(data) === '{"status":200}') {
              $(".customBackground").fadeOut("slow");
              $("#customInfoDeleteBox").fadeOut("slow");

              calendar.refetchEvents();


              customAlert(" Event deleted", "fa fa-trash", "green");
            } else {

              customAlert(" Event not deleted", "fa fa-warning", "red");

            }


          }).fail(function (jqXHR, textStatus, error) {

            customAlert(" "+textStatus, "fa fa-warning", "red");
          });


        });




  }



  function update(arg){
    var id = arg.event.id;
    var title = arg.event.title;
    var start = arg.event.start;
    var end = arg.event.end;

    console.log(id);

     var dt = '{"title":"' + title + '","start":' + Date.parse(start) + ',"end":' + Date.parse(end) + ', "id":"'+ id +'","allDay": false}'


    $.ajax({
        url: "/calender/updateEvent",
        contentType: "application/json",
        method: "POST",
        data: dt,
        headers: {
          'Csrf-Token': $("input[name='csrfToken']").val()
        }
      }).done(function (data){

        if (JSON.stringify(data) === '{"status":200}') {
                calendar.refetchEvents();

                customAlert(" Event updated", "fa fa-check-circle", "green");
          } else {

                customAlert(" Event not updated", "fa fa-warning", "red");

          }


      }).fail(function (jqXHR, textStatus, error) {

            customAlert(" "+textStatus, "fa fa-warning", "red");
        });
  }


  function customAlert(message, alertClass, color) {
    /*get scroll position*/
    var eTop = $('body').offset().top;
    var scrollPosition= -1*(eTop - $(window).scrollTop())
    /*set alert height and width*/
    $(".customAlertBackground").css("width", $(document).width());
    $(".customAlertBackground").css("height", $(document).height());
    $(".customAlertBackground").fadeIn("slow");

    $(".customAlertBox").fadeIn("slow");
    $(".customAlertBox").css("top",scrollPosition.toString()+"px");

    $("#customAlertBoxMessage").addClass(alertClass);
    $("#customAlertBoxMessage").css("color", color);
    $("#customAlertBoxMessage").html(message);

    $("#customAlertBoxClose").click(e => {
      $(".customAlertBackground").fadeOut("slow");
      $(".customAlertBox").fadeOut("slow");
    });


  }

  /*process event create form*/
  function processModalFormData() {
    var eventTitle = $("input[name='title']").val();
    var eventStartDate = $("input[name='startDate']").val();
    var eventStartTime = $("input[name='startTime']").val();
    var eventEndDate = $("input[name='endDate']").val();
    var eventEndTime = $("input[name='endTime']").val();



    if (eventTitle != "" && eventStartDate != "" && eventEndDate != "") {


      var iid = uuidv4();
      var startAsMilliSeconds = Date.parse(new Date(eventStartDate + 'T' + eventStartTime));
      var endAsMilliSeconds = Date.parse(new Date(eventEndDate + 'T' + eventEndTime));

      var dt = '{"title":"' + eventTitle + '","start":' + startAsMilliSeconds + ',"end":' + endAsMilliSeconds + ', "id":"'+ iid +'","allDay": false}'

      $.ajax({
        url: "/calender/addEvent",
        contentType: "application/json",
        method: "POST",
        data: dt,
        headers: {
          'Csrf-Token': $("input[name='csrfToken']").val()
        }
      }).done(function (data) {

        if (JSON.stringify(data) === '{"status":200}') {

          calendar.refetchEvents();

          /*first clear form data*/
          clearFormData();
          /*close create form*/
          $(".customBackground").fadeOut("slow");
          $("#eventCreateForm").fadeOut("slow");

          customAlert(" Event Created", "fa fa-check-circle", "green");
        } else {

          customAlert(" Event not created", "fa fa-warning", "red");

        }

      }).fail(function (jqXHR, textStatus, error) {
          customAlert(" "+textStatus, "fa fa-warning", "red");
      });

    } else {
      customAlert(" Plz fill up all the fields", "fa fa-warning", "red");
    }


  }


  /*clear input form data*/
  function clearFormData() {
    $("input[name='title']").val("");
    $("input[name='startDate']").val("");
    $("input[name='startTime']").val("");
    $("input[name='endDate']").val("");
    $("input[name='endTime']").val("");
  }


  function displayCreateEventForm() {
    $(".customBackground").css("width", $(document).width());
    $(".customBackground").css("height", $(document).height());
    $(".customBackground").fadeIn("slow");

    $("#eventCreateForm").fadeIn("slow");
  }


  function closeEventCreateForm() {
    $(".closeCreateEventFormButton").click(e => {
      $(".customBackground").fadeOut("slow");
      $("#eventCreateForm").fadeOut("slow");
      clearFormData();
    });
  }

  closeEventCreateForm();

  /*if clicked on add event button display Event Create Form*/
  $("#addNewEventButton").click(e => {
    displayCreateEventForm();
  });


  /*if click on submit button Create Event*/
  function addEventToDb() {

    $("#eventSubmitModalButton").click(function (e) {
      processModalFormData();
    });
  }


  addEventToDb();



  function selectForm(arg) {
    var eventTitle = null;

    $(".customBackground").css("width", $(document).width());
    $(".customBackground").css("height", $(document).height());
    $(".customBackground").fadeIn("slow");
    $("#miniEventCreateForm").fadeIn("slow");

    $("#miniEventSubmitModalButton").click(e => {

      eventTitle = $("input[name='mini-title']").val();

      if (eventTitle != null) {

        var iid = uuidv4();

        console.log(arg.start)

        var dt = '{"title":"' + eventTitle + '","start":' + Date.parse(arg.start) + ',"end":' + Date.parse(arg.end) + ', "id":"'+ iid +'","allDay":'+arg.allDay+'}'

        $.ajax({
          url: "/calender/addEvent",
          contentType: "application/json",
          method: "POST",
          data: dt,
          headers: {
            'Csrf-Token': $("input[name='csrfToken']").val()
          }
        }).done(function (data) {

          if (JSON.stringify(data) === '{"status":200}') {
            /*first clear form data*/
            $("input[name='title']").val("");
            /*close create form*/
            $(".customBackground").fadeOut("slow");
            $("#miniEventCreateForm").fadeOut("slow");

            calendar.refetchEvents();

            customAlert(" Event Created", "fa fa-check-circle", "green");
          } else {

            customAlert(" Event not created", "fa fa-warning", "red");

          }

        }).fail(function (jqXHR, textStatus, error) {
            customAlert("Network Error", "fa fa-warning", "red");
        });


      } else {
        customAlert(" Plz fill up all the fields", "fa fa-warning", "red");
      }

    });

    /*if clicked on close button of miniEvent Create Form*/
    $("#miniCloseCreateEventFormButton").click(e =>{
        $(".customBackground").fadeOut("slow");
        $("#miniEventCreateForm").fadeOut("slow");
    });

  }



  /*####################################################*/
  var calendar = new FullCalendar.Calendar(calendarEl, {
    plugins: ['interaction', 'dayGrid', 'timeGrid'],
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    defaultDate: new Date(),
    navLinks: true, // can click day/week names to navigate views
    selectable: true,
    resizable:true,
    selectMirror: false,
    select: function (arg) {
       var title = prompt("Enter title");
       if(title!=null){
       var iid = uuidv4();
         var dt = '{"title":"' + title + '","start":' + Date.parse(arg.start) + ',"end":' + Date.parse(arg.end) + ', "id":"'+ iid +'","allDay":'+arg.allDay+'}'

          $.ajax({
            url: "/calender/addEvent",
            contentType: "application/json",
            method: "POST",
            data: dt,
            headers: {
              'Csrf-Token': $("input[name='csrfToken']").val()
            }
          }).done(function (data) {

            if (JSON.stringify(data) === '{"status":200}') {
              /*first clear form data*/
              $("input[name='title']").val("");
              /*close create form*/
              $(".customBackground").fadeOut("slow");
              $("#miniEventCreateForm").fadeOut("slow");

              calendar.refetchEvents();

              customAlert(" Event Created", "fa fa-check-circle", "green");
            } else {

              customAlert(" Event not created", "fa fa-warning", "red");

            }

          }).fail(function (jqXHR, textStatus, error) {
              customAlert("Network Error", "fa fa-warning", "red");
          });
       }

      calendar.unselect();
    },

    editable: true,
    eventLimit: true, // allow "more" link when too many
    eventSources: [{
      url: '/calender/fetchEvents'
    }],
    eventClick: function(arg) {
       infoAndDelete(arg);
     },

     eventResize: function(arg){
       update(arg);
     },
     eventDrop : function(arg){
      update(arg);
     }
  });




  calendar.render();


  /*calendar height in mobile view adjusting*/
  $(".fc-scroller").css("height", "100% !important");
  $(".fc-scroller").css("overflow", "inherit !important");



  /*as with the change of view here css set is necessary*/
  $(".fc-button-group button").click(e => {
    $(".fc-scroller").css("height", "100%");
    $(".fc-scroller").css("overflow", "inherit !important");
  });
  /*this button need special care*/
  $(".fc-today-button button").click(e => {
    $(".fc-scroller").css("height", "100%");
    $(".fc-scroller").css("overflow", "inherit !important");
  });


});
