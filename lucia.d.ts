/// <reference types="lucia-auth" />
declare namespace Lucia {
	type Auth = import('@/server/api/auth/[...]').Auth;
	type UserAttributes = {
		username: string;
	};
}
