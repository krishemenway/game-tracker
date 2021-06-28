export interface UserProfileTheme {
	PanelBackgroundColor: string;
	PanelAlternatingBackgroundColor: string;
	PanelBorderColor: string;
	PageBackgroundColor: string;
	GraphPrimaryColor: string;
	PrimaryTextColor: string;
	SecondaryTextColor: string;
}

class UserProfileThemeStore {
	public static CurrentTheme: UserProfileTheme = {
		PageBackgroundColor: "",
		PanelBorderColor: "",
		PanelBackgroundColor: "",
		PanelAlternatingBackgroundColor: "",
		GraphPrimaryColor: "",
		PrimaryTextColor: "",
		SecondaryTextColor: "",
	};
}

export default UserProfileThemeStore;