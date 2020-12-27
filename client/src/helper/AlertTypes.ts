/* eslint-disable max-classes-per-file */
export interface Alert {
  defaultHeader: string;
  color: string;
}

export class Warning implements Alert {
  defaultHeader = "elements.alerts.warning";

  color = "w3-yellow";
}

export class Success implements Alert {
  defaultHeader = "elements.alerts.success";

  color = "w3-green";
}

export class Info implements Alert {
  defaultHeader = "elements.alerts.info";

  color = "w3-blue";
}

export class Error implements Alert {
  defaultHeader = "elements.alerts.error";

  color = "w3-red";
}

export class Alerts {
  static WARNING: Warning = new Warning();

  // This overwrites the standard Error class. Use only in this file!
  // eslint-disable-next-line unicorn/error-message
  static ERROR: Error = new Error();

  static INFO: Info = new Info();

  static SUCCESS: Success = new Success();
}
/* eslint-enable max-classes-per-file */
