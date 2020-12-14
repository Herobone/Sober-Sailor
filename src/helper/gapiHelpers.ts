// This class contains Helpers if you are using GAPI

export const signOutGAPI = () => {
    if (gapi.auth2) {
        if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
            gapi.auth2.getAuthInstance().signOut();
        }
    }
}