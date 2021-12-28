import { Observable, ObservableArray } from "@residualeffect/reactor";
import { Http } from "Common/Http";
import { Loadable } from "Common/Loadable";
import { EditableField } from "Common/EditableField";
import { UserProfileTheme } from "UserProfile/UserProfileTheme";

interface ControlPanelStatusResponse {
	ObservedProcesses: ObservedProcess[];
	RunningProcesses: RunningProcess[];
	RecentProcesses: ProcessSession[];

	UserName: string;
	Email: string;
	Theme: UserProfileTheme;
	WebPort: number;
	GamesUrl: string;
	ProcessScanIntervalInSeconds: number;
	StartsWithExclusions: string[];
	ProcessNameExclusions: string[];

	ExecutablePath: string;
	ProcessSessionPath: string;
	UserActivityPath: string;
	BaseIconFolderPath: string;

	AppMarkupPath: string;
	AppJavascriptPath: string;
	FaviconPath: string;
}

export interface ProcessSession {
	ProcessSessionId: string;
	FilePath: string;
	StartTime: string;
	EndTime: string;
}

export interface RunningProcess {
	ProcessName: string;
	StartTime: string;
	FilePath: string;
}

export interface ObservedProcess {
	ProcessName: string;
	ProcessPath: string;
	Ignore: boolean;
}

export class ModifiableObservedProcess {
	constructor(process: ObservedProcess) {
		this.Id = ModifiableObservedProcess.LastId++;
		this.Ignore = new Observable<boolean>(process.Ignore);
		this.ProcessPath = process.ProcessPath;
	}

	public Id: number;
	public Ignore: Observable<boolean>;
	public ProcessPath: string;

	private static LastId = 0;
}

export class ControlPanelSettings {
	constructor(response: ControlPanelStatusResponse) {
		this.Current = response;

		this.UserName = new EditableField("UserName", response.UserName);
		this.Email = new EditableField("Email", response.Email);
		this.WebPort = new EditableField("WebPort", response.WebPort.toString(), undefined, (v) => parseInt(v, 10).toString());
		this.GamesUrl = new EditableField("GamesUrl", response.GamesUrl);

		this.PanelBackgroundColor = new EditableField("PanelBackgroundColor", response.Theme.PanelBackgroundColor);
		this.PanelAlternatingBackgroundColor = new EditableField("PanelAlternatingBackgroundColor", response.Theme.PanelAlternatingBackgroundColor);
		this.PanelBorderColor = new EditableField("PanelBorderColor", response.Theme.PanelBorderColor);
		this.PageBackgroundColor = new EditableField("PageBackgroundColor", response.Theme.PageBackgroundColor);
		this.GraphPrimaryColor = new EditableField("GraphPrimaryColor", response.Theme.GraphPrimaryColor);
		this.PrimaryTextColor = new EditableField("PrimaryTextColor", response.Theme.PrimaryTextColor);
		this.SecondaryTextColor = new EditableField("SecondaryTextColor", response.Theme.SecondaryTextColor);

		this.ProcessScanIntervalInSeconds = new EditableField("ProcessScanIntervalInSeconds", response.ProcessScanIntervalInSeconds.toString(), undefined, (v) => parseInt(v, 10).toString());
		this.AllObservedProcesses = new ObservableArray<ModifiableObservedProcess>(response.ObservedProcesses.sort((a, b) => a.ProcessPath < b.ProcessPath ? -1 : 1).map((p) => new ModifiableObservedProcess(p)));
	}

	public Current: ControlPanelStatusResponse;

	public UserName: EditableField;
	public Email: EditableField;
	public WebPort: EditableField;
	public GamesUrl: EditableField;

	public PanelBackgroundColor: EditableField;
	public PanelAlternatingBackgroundColor: EditableField;
	public PanelBorderColor: EditableField;
	public PageBackgroundColor: EditableField;
	public GraphPrimaryColor: EditableField;
	public PrimaryTextColor: EditableField;
	public SecondaryTextColor: EditableField;

	public ProcessScanIntervalInSeconds: EditableField;
	public AllObservedProcesses: ObservableArray<ModifiableObservedProcess>;
}

export class ControlPanelService {
	constructor() {
		this.Update = new Loadable<any>();
		this.Toggle = new Loadable<any>();
		this.Status = new Loadable<ControlPanelSettings>("Something went wrong loading observed processes from the server. Can only view this tool on the device running the service.");
	}

	public LoadStatus(): void {
		Http.get<ControlPanelStatusResponse, ControlPanelSettings>("/WebAPI/ControlPanel/Status", this.Status, (r) => new ControlPanelSettings(r));
	}

	public UpdateSetting(field: EditableField, onComplete: () => void): void {
		if (field.HasChanged.Value && field.CanMakeRequest()) {
			Http.post("/WebAPI/ControlPanel/SaveSetting", { Field: field.FieldId, Value: field.Current.Value }, this.Update).then(() => { field.OnSaved(); onComplete(); });
		} else {
			onComplete();
		}
	}

	public OnToggleIgnored(observableProcess: ModifiableObservedProcess, ignore: boolean): void {
		Http.post("/WebAPI/ControlPanel/ToggleIgnorePath", { FilePath: observableProcess.ProcessPath, Ignore: ignore }, this.Toggle).then((_) => { observableProcess.Ignore.Value = ignore; });
	}

	public Status: Loadable<ControlPanelSettings>;
	public Update: Loadable<any>;
	public Toggle: Loadable<any>;

	static get Instance(): ControlPanelService {
		if (this._instance === undefined) {
			this._instance = new ControlPanelService();
		}

		return this._instance;
	}

	private static _instance: ControlPanelService;
}
