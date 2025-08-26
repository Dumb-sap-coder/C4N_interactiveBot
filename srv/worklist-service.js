// // srv/worklist-service.js
// const cds = require('@sap/cds');

// module.exports = cds.service.impl(function () {
//   const { WorklistItems } = this.entities;  

//   this.on('syncLogs', async () => {
//     const remote = await cds.connect.to('ZNB_APPL_LOG_SRV_01');
//     const result = await remote.run(SELECT.from('applogSet'));

//     const mapped = result.map(r => ({
//       lognumber: r.Lognumber,
//       object: r.Object,
//       subobject: r.Subobject,
//       extnumber: r.Extnumber,
//       aldate: r.Aldate,
//       altime: r.Altime,
//       aluser: r.Aluser,
//       userexitp: r.Userexitp,
//       text: r.Text
//     }));

//     await UPSERT.into(WorklistItems).entries(mapped);
//     return { count: mapped.length };
//   });
// });


const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {

  this.on('READ', 'WorklistItems', async (req) => {
    const tx = cds.tx(req); 
    let items = await tx.run(SELECT.from('externalLogs.applogSet').limit(100));

    // Map fields
    return items.map(item => ({
      lognumber: item.LogNumber,
      object: item.Object,
      subobject: item.SubObject,
      extnumber: item.ExtNumber,
      aldate: item.Aldate,
      altime: item.Altime,
      aluser: item.Aluser,
      text: item.Text
    }));
  });

});