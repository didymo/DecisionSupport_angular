import * as url from "node:url";

export class ReferenceLink {
  constructor(url: string, label: string, description: string, sectionId: string, icon: string) {
    this._url = url;
    this._label = label;
    this._description = description;
    this._sectionId = sectionId;
    this._icon = icon;
  }

  /** Target URL (absolute or in‑app relative path). */
  private _url: string;

  get url(): string {
    return this._url;
  }

  set url(value: string) {
    this._url = value;
  }

  /** Human‑readable link text shown to the user. */
  private _label: string;

  get label(): string {
    return this._label;
  }

  set label(value: string) {
    this._label = value;
  }

  /** Short explanation of what the user will find at the URL. */
  private _description: string;

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  /** Option: If you need to tie the reference to a specific part of a page. */
  private _sectionId: string;

  get sectionId(): string {
    return this._sectionId;
  }

  set sectionId(value: string) {
    this._sectionId = value;
  }

  /** Option: show a small pictogram next to the link. */
  private _icon: string;

  get icon(): string {
    return this._icon;
  }

  set icon(value: string) {
    this._icon = value;
  }
}

