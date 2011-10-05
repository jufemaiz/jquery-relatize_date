// All credit goes to Rick Olson.
(function($) {
  $.fn.relatizeDate = function() {
    return $(this).each(function() {
      $(this).text( $.relatizeDate(this) )
    })
  }

  $.relatizeDate = function(element) {
    return $.relatizeDate.timeAgoInWords( new Date($(element).text()) )
  }

  // shortcut
  $r = $.relatizeDate

  $.extend($.relatizeDate, {
    shortDays: [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    shortMonths: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
    months: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],

    /**
     * Given a formatted string, replace the necessary items and return.
     * Example: Time.now().strftime("%B %d, %Y") => February 11, 2008
     * @param {String} format The formatted string used to format the results
     */
    strftime: function(date, format) {
      var day = date.getDay(), month = date.getMonth();
      var hours = date.getHours(), minutes = date.getMinutes();

      var pad = function(num, len) {
		if(len == null) { len = 2; }
        var string = num.toString(10);
        return new Array((len - string.length) + 1).join('0') + string
      };

      return format.replace(/\%([aAbBcCdDeFhHIjklLmMnrRsStTuUvVwWxXyYzZ\%|3N|6N|9N])/g, function(part) {
        switch(part[1]) {
          case 'a': return $r.shortDays[day]; break;
          case 'A': return $r.days[day]; break;
          case 'b': return $r.shortMonths[month]; break;
          case 'B': return $r.months[month]; break;
          case 'c': return Math.floor(date.getFullYear()/100).toString(); break;
          case 'C': return date.getYear(); break;
          case 'd': return pad(date.getDate()); break;
          case 'D': return $r.strftime(date,"%m/%d/%y"); break;
          case 'e': return (date.getDate()); break;
          case 'F': return $r.strftime(date,"%Y-%m-%d"); break;
          case 'h': return $r.strftime(date,"%b"); break;
          case 'H': return pad(hours); break;
          case 'I': return pad(hours > 12 ? hours - 12 : hours); break;
          case 'j': return "TODO"/* day of year 001..366 */; break;
          case 'k': return hours.toString(); break;
          case 'l': return (hours > 12 ? hours - 12 : (hours == 0 ? 12 : hours) ).toString(); break;
          case 'L': return pad(date.getMilliseconds(),3); break;
          case 'm': return pad(month + 1); break;
          case 'M': return pad(minutes); break;
          case 'n': return "\n"; break; // Newline (\n)
          case '3N': return pad(date.getMilliseconds(),3); break; // millisecond (3 digits)
          case '6N': return pad(date.getMilliseconds()*1000,6); break; // microsecond (6 digits)
          case '9N': return pad(date.getMilliseconds()*1000000,9); break; // nanosecond (9 digits)
          case 'p': return hours > 11 ? 'PM' : 'AM'; break;
          case 'P': return $r.strftime(date,"%p").toLowerCase(); break;
          case 'r': return $r.strftime(date,"%I:%M:%S %p"); break;
          case 'R': return $r.strftime(date,"%H:%M"); break;
          case 's': return date; break;	// Number of seconds since 1970-01-01 00:00:00 UTC.
          case 'S': return pad(date.getSeconds()); break;
          case 't': return "\t"; break; // Tab character (\t)
          case 'T': return $r.strftime(date,"%H:%M:%S"); break;
          case 'u': return (date.getDay() == 0 ? 7 : date.getDay()); break; // 
          case 'U': return "TODO"; break; // Week  number  of the current year, starting with the first Sunday as the first day of the first week (00..53)
          case 'v': return $r.strftime(date,"%e-%b-%Y"); break; // %e-%b-%Y
          case 'V': return "TODO"; break; // Week number of year according to ISO 8601 (01..53)
          case 'w': return day; break;
          case 'W': return "TODO"; break; // Week  number  of the current year, starting with the first Monday as the first day of the first week (00..53)
          case 'x': return $r.strftime(date,"%Y-%m-%d"); break; // Preferred representation for the date alone, no time
          case 'X': return $r.strftime(date,"%H:%M:%S"); break; // Preferred representation for the time alone, no date
          case 'y': return pad(date.getFullYear() % 100); break;
          case 'Y': return date.getFullYear().toString(); break;
          case 'z': return (date.getTimezoneOffset() <= 0 ?"+":"")+(-1*(Math.floor(date.getTimezoneOffset()/60)*100 + date.getTimezoneOffset()%60)); break;
          case 'Z': return $r.strftime(date,"%z"); break;
          case '%': return '%'; break;
        }
      })
    },
  
    timeAgoInWords: function(targetDate, includeTime) {
      return $r.distanceOfTimeInWords(targetDate, new Date(), includeTime);
    },
  
    /**
     * Return the distance of time in words between two Date's
     * Example: '5 days ago', 'about an hour ago'
     * @param {Date} fromTime The start date to use in the calculation
     * @param {Date} toTime The end date to use in the calculation
     * @param {Boolean} Include the time in the output
     */
    distanceOfTimeInWords: function(fromTime, toTime, includeTime) {
      var delta = parseInt((toTime.getTime() - fromTime.getTime()) / 1000);
      if (delta < 60) {
          return 'less than a minute ago';
      } else if (delta < 120) {
          return 'about a minute ago';
      } else if (delta < (45*60)) {
          return (parseInt(delta / 60)).toString() + ' minutes ago';
      } else if (delta < (120*60)) {
          return 'about an hour ago';
      } else if (delta < (24*60*60)) {
          return 'about ' + (parseInt(delta / 3600)).toString() + ' hours ago';
      } else if (delta < (48*60*60)) {
          return '1 day ago';
      } else {
        var days = (parseInt(delta / 86400)).toString();
        if (days > 5) {
          var fmt  = '%B %d, %Y'
          if (includeTime) fmt += ' %I:%M %p'
          return $r.strftime(fromTime, fmt);
        } else {
          return days + " days ago"
        }
      }
    }
  })
})(jQuery);
