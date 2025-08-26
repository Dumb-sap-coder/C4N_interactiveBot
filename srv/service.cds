using { ZNB_APPL_LOG_SRV_01 as externalLogs } from './external/ZNB_APPL_LOG_SRV_01.cds'; 
using { interactive_bot as ib } from '../db/schema.cds';

// @path : '/external'
// service ExternalSGDService {
//     entity ApplLogs as projection on externalLogs.applogSet;
// }

@path : '/worklist'
service WorklistService {
    entity WorklistItems as projection on externalLogs.applogSet;
    // entity WorklistItems as projection on ib.WorklistItems;
}

@path : '/chat'
service ChatService {
    entity Sessions as projection on ib.Sessions;
    entity Messages as projection on ib.Messages;

    /** Start a new session from a worklist item */
    action StartSessionFromLog(
        logId   : String(20),
        startedBy : String(80)
    ) returns Sessions;

    /** Send a message inside a session */
    action SendMessage(
        session : UUID,
        sender  : ib.Role,
        text    : String(5000)
    ) returns Messages;
}
