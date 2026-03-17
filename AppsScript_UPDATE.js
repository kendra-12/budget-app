// ============================================================
// UPDATED Google Apps Script — add this to your existing script
// ============================================================
//
// You need to add TWO things to your existing Apps Script:
//
// 1. In your doGet() function, add the prediction state reading
// 2. Add a doPost() function to handle saving prediction state
//
// STEP-BY-STEP:
// a) Open your Google Sheet
// b) Create a new tab/sheet called "PredictionState" (just one cell will be used: A1)
// c) Go to Extensions > Apps Script
// d) Update your code as shown below
// e) Click Deploy > Manage Deployments > Edit (pencil icon) > New Version > Deploy
//
// ============================================================

// In your existing doGet() function, ADD these lines right before
// the final "return ContentService..." line:
//
//   // --- Prediction State ---
//   try {
//     var predSheet = ss.getSheetByName('PredictionState');
//     if (predSheet) {
//       var predVal = predSheet.getRange('A1').getValue();
//       if (predVal) result.predictionState = predVal;
//     }
//   } catch(e) {}
//
// That's it for the GET side.

// Then ADD this entire doPost function to your script:

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);

    // Verify key
    if (body.key !== 'mybudgetdata_kna12!') {
      return ContentService.createTextOutput(JSON.stringify({error:'Unauthorized'}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (body.action === 'savePredictionState') {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var predSheet = ss.getSheetByName('PredictionState');
      if (!predSheet) {
        predSheet = ss.insertSheet('PredictionState');
      }
      // Store as JSON string in cell A1
      predSheet.getRange('A1').setValue(JSON.stringify(body.data));

      return ContentService.createTextOutput(JSON.stringify({success:true}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({error:'Unknown action'}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({error:err.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
