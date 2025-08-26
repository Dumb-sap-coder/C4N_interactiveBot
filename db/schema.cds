using { ZNB_APPL_LOG_SRV_01 as external } from '../srv/external/ZNB_APPL_LOG_SRV_01.cds'; 
namespace interactive_bot;

using { managed } from '@sap/cds/common';

// type Role : String enum {
//   user;
//   bot;
//   system; 
// }


// /** Error logs from SAP OData */
// entity WorklistItems : managed {
//   key lognumber : String(20);
//   object        : String;
//   subobject     : String;
//   extnumber     : String;
//   aldate        : Date;
//   altime        : Time;
//   aluser        : String;
//   userexitp     : String;
//   text          : String(2000);

//   // One WorklistItem -> many Sessions (different users can have their own chats)
//   sessions      : Composition of many Sessions on sessions.sourceLog = $self;
// }

// /** Conversational session */
// entity Sessions : managed {
//   key ID        : UUID;
//   title         : String(100);
//   startedBy     : String(80);   // user who created the session

//   sourceLog     : Association to WorklistItems;
//   messages      : Composition of many Messages on messages.session = $self;
// }

// /** Messages within a session */
// entity Messages : managed {
//   key msgID     : UUID;
//   role          : Role;
//   text          : String(5000);

//   session       : Association to Sessions;
// }
