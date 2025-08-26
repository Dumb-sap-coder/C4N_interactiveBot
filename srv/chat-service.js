// const cds = require('@sap/cds')

// module.exports = async (srv) => {
//   const { Sessions, Messages, WorklistItems } = srv.entities

//   // Action: Start session for a log
//   srv.on('StartSessionForLog', async (req) => {
//     const { logId } = req.data

//     // Check if session already exists for this user + log
//     let session = await cds.tx(req).run(
//       SELECT.one.from(Sessions).where({ worklist_ID: logId, createdBy: req.user.id })
//     )

//     if (!session) {
//       // fetch worklist item
//       const worklistItem = await cds.tx(req).run(
//         SELECT.one.from(WorklistItems).where({ Lognumber: logId })
//       )
//       if (!worklistItem) return req.error(404, `Log ${logId} not found`)

//       // create new session
//       session = {
//         ID: cds.utils.uuid(),
//         worklist_ID: logId,
//         createdAt: new Date(),
//         createdBy: req.user.id
//       }
//       await cds.tx(req).run(INSERT.into(Sessions).entries(session))

//       // add first message with error text
//       const message = {
//         ID: cds.utils.uuid(),
//         session_ID: session.ID,
//         role: 'system', // or 'log'
//         text: worklistItem.Text,
//         createdAt: new Date()
//       }
//       await cds.tx(req).run(INSERT.into(Messages).entries(message))
//     }

//     return session
//   })

//   // Action: Send message
//   srv.on('SendMessage', async (req) => {
//     const { session, text } = req.data
//     const message = {
//       ID: cds.utils.uuid(),
//       session_ID: session,
//       role: 'user',
//       text,
//       createdAt: new Date()
//     }
//     await cds.tx(req).run(INSERT.into(Messages).entries(message))

//     return message
//   })
// }
