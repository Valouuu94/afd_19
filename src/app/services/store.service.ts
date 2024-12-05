import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class StoreService {
	private readonly _userId = new BehaviorSubject<string>('');
	readonly userId$ = this._userId.asObservable();

	private readonly _userName = new BehaviorSubject<string>('');
	readonly userName$ = this._userName.asObservable();

	private readonly _userEntite = new BehaviorSubject<string>('');
	readonly _userEntite$ = this._userEntite.asObservable();

	private readonly _userRole = new BehaviorSubject<string>('');
	readonly userRole$ = this._userRole.asObservable();

	private readonly _userPerimetre = new BehaviorSubject<string>('');
	readonly userPerimetre$ = this._userPerimetre.asObservable();

	private readonly _userContext = new BehaviorSubject<any>('');
	readonly userContext$ = this._userContext.asObservable();

	private readonly _rights = new BehaviorSubject<any>('');
	readonly rights$ = this._rights.asObservable();

	getUserId(): string {
		return this._userId.getValue();
	}
	setUserId(value: string) {
		this._userId.next(value);
	}

	getUserName(): string {
		return this._userName.getValue();
	}
	setUserName(value: string) {
		this._userName.next(value);
	}

	getUserEntite(): string {
		return this._userEntite.getValue();
	}
	setUserEntite(value: string) {
		this._userEntite.next(value);
	}

	getUserRole(): string {
		return this._userRole.getValue();
	}
	setUserRole(value: string) {
		this._userRole.next(value);
	}

	getUserPerimetre(): string {
		return this._userPerimetre.getValue();
	}
	setUserPerimetre(value: string) {
		this._userPerimetre.next(value);
	}

	getUserContext(): any {
		return this._userContext.getValue();
	}
	setUserContext(value: any) {
		this._userContext.next(value);
	}

	getRights(): any {
		return this._rights.getValue();
	}
	setRights(value: any) {
		this._rights.next(value);
	}
}