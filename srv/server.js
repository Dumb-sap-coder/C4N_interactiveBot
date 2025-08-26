// const cds = require('@sap/cds')

// cds.on('served', async () => {


//     const extSrv = await cds.connect.to('ExternalSGDService')      // external OData
//     const db = await cds.connect.to('db')

//     // reusable sync function
//     async function syncLogs() {
//         try {
//             console.log('Fetching latest logs from external OData...')

//             const externalLogs = await extSrv.run(SELECT.from('ApplLogs'))
//             console.log(`Fetched ${externalLogs.length} logs`)
//             console.log('Raw externalLogs:', externalLogs)

//             for (const log of externalLogs) {
//                 await db.run(
//                     INSERT.into('interactive_bot_WorklistItems').entries({
//                         lognumber: log.Lognumber || log.lognumber,
//                         object: log.Object || log.object,
//                         subobject: log.Subobject || log.subobject,
//                         extnumber: log.Extnumber || log.extnumber,
//                         aldate: log.Aldate || log.aldate,
//                         altime: log.Altime || log.altime,
//                         aluser: log.Aluser || log.aluser,
//                         userexitp: log.Userexitp || log.userexitp,
//                         text: log.Text || log.text
//                     }).onConflict('lognumber').merge()
//                 )
//             }

//             console.log('✅ Logs synced successfully')
//         } catch (err) {
//             console.error('❌ Error syncing logs', err)
//         }
//     }


//     // run once immediately
//     await syncLogs()

//     // run every 10 minutes
//     setInterval(syncLogs, 10 * 60 * 1000)
// })
// const cds = require('@sap/cds');

// module.exports = cds.service.impl(async function () {
//   const { WorklistItems } = this.entities;

//   this.on('syncLogs', async () => {
//     const remote = await cds.connect.to('ZNB_APPL_LOG_SRV_01');
//     const result = await remote.run(SELECT.from('applog'));  // external entity

//     // Map & upsert into CAP entity
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
