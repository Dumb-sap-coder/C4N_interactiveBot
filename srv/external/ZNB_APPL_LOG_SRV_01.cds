/* checksum : ea5da0d03c9855e820d81ead4ffbe32e */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
@sap.supported.formats : 'atom json xlsx'
service ZNB_APPL_LOG_SRV_01 {
  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.deletable : 'false'
  @sap.pageable : 'false'
  @sap.content.version : '1'
  entity applogSet {
    @sap.unicode : 'false'
    @sap.label : 'Log Number'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.sortable : 'false'
    @sap.filterable : 'false'
    key Lognumber : String(20) not null;
    @sap.unicode : 'false'
    @sap.label : 'Object'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.sortable : 'false'
    @sap.filterable : 'false'
    Object : String(20) not null;
    @sap.unicode : 'false'
    @sap.label : 'Subobject'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.sortable : 'false'
    @sap.filterable : 'false'
    Subobject : String(20) not null;
    @sap.unicode : 'false'
    @sap.label : 'External ID'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.sortable : 'false'
    @sap.filterable : 'false'
    Extnumber : String(100) not null;
    @sap.unicode : 'false'
    @sap.label : 'Date'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.sortable : 'false'
    @sap.filterable : 'false'
    Aldate : String(10) not null;
    @sap.unicode : 'false'
    @sap.label : 'Time'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.sortable : 'false'
    @sap.filterable : 'false'
    Altime : String(8) not null;
    @sap.unicode : 'false'
    @sap.label : 'User'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.sortable : 'false'
    @sap.filterable : 'false'
    Aluser : String(12) not null;
    @sap.unicode : 'false'
    @sap.label : 'Callback: Progr'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.sortable : 'false'
    @sap.filterable : 'false'
    Userexitp : String(40) not null;
    @sap.unicode : 'false'
    @sap.label : 'Data field'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.sortable : 'false'
    @sap.filterable : 'false'
    Text : String(250) not null;
  };
};

