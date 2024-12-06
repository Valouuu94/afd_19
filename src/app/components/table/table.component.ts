import { Component, OnInit, input, output } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { FormatNumberInput } from '../../directives/format-number/formatNumberInput';
import { SpinnerComponent } from '../spinner/spinner.component';
import { FormsModule } from '@angular/forms';
import { NgIf, NgClass, NgFor } from '@angular/common';

declare const app: any;
declare const lang: any;
declare const columns: any;

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    standalone: true,
    imports: [NgIf, NgClass, FormsModule, NgFor, SpinnerComponent, FormatNumberInput]
})
export class TableComponent implements OnInit {

	currentPage: number = 1;
	maxPages = 10;

	items: any = [];
	itemsRaw: any = [];
	urlParam: string = '';
	filter: string = '';
	filters: any;
	currentSort: string = '';
	currentSortDesc: boolean = false;
	lang: any = lang;
	loading: boolean = false;
	loadingExport: boolean = false;
	errorLoading: boolean = false;
	userRole: string = '';
	entite: string = '';
	unfolded: boolean = false;
	app: any = app;
	showPaginationFirstDots: boolean = false;
	showPaginationLastDots: boolean = false;
	isLoadingBtnAdd: boolean = false;
	clickInProgress: boolean = false;

	readonly isInsideModal = input<boolean>(false);
	readonly type = input<any>();
	readonly url = input<any>();
	readonly parentItems = input<any>();
	readonly manualLoading = input<any>();
	readonly itemsByPage = input<any>();
	readonly enableAdd = input<any>();
	readonly enablePagination = input<any>(true);
	readonly enableRefresh = input<any>(true);
	readonly enableExport = input<boolean>(false);
	readonly idRefresh = input<any>();
	readonly read = input<any>();
	readonly disabledEditAndDelete = input<any>();
	readonly hideFilters = input<any>();
	readonly hideSubfilters = input<any>();
	readonly hideFooter = input<any>();
	readonly hideSort = input<any>();
	readonly advancedFiltersUnfolded = input<any>();
	readonly forceAction = input<any>();
	readonly highlightIf = input<any>();
	readonly highlightIfValue = input<any>();
	readonly highlightMode = input<any>('');
	readonly lineClickable = input<any>(false);
	readonly filtersButtons = input<any>();
	readonly noMT = input<boolean>(false);
	readonly maxContentColumn = input<boolean>(false);
	readonly isScrollable = input<boolean>(false);
	readonly noRightBtn = input<boolean>(false);
	readonly fixSecChild = input<boolean>(false);

	readonly goto = output();
	readonly add = output();
	readonly treat = output();
	readonly affect = output();
	readonly edit = output();
	readonly payback = output();
	readonly update = output();
	readonly delete = output();
	readonly validate = output();
	readonly file = output();
	readonly addSPC = output();
	readonly select = output();
	readonly incOrder = output();
	readonly decOrder = output();
	readonly refresh = output();
	readonly export = output();

	constructor(public store: StoreService) { }

	async ngOnInit() {
		this.unfolded = this.advancedFiltersUnfolded();
		this.userRole = this.store.getUserRole();
		this.entite = this.store.getUserEntite();

		if (!this.manualLoading())
			this.getItems();

		this.initFilters();
	}

	get columns() {
		return columns[this.type()];
	}
	get itemsCount() {
		return this.items.length;
	}
	get pagesCount() {
		return Math.ceil(this.itemsCount / this.itemsByPage());
	}
	get pagesCountArray() {
		var result = [];

		if (this.pagesCount > this.maxPages) {
			this.showPaginationFirstDots = true;
			this.showPaginationLastDots = true;
			var startPage = this.currentPage - ((this.maxPages - 4) / 2);

			if (startPage < 2)
				startPage = 2;

			if (startPage > this.pagesCount - (this.maxPages - 3))
				startPage = this.pagesCount - (this.maxPages - 3);

			for (var i = startPage; i <= this.pagesCount - 1; i++)
				if (result.length < this.maxPages - 3)
					result.push(i);

			this.showPaginationFirstDots = (startPage != 2);
			this.showPaginationLastDots = (result[result.length - 1] != this.pagesCount - 1);
		} else
			for (var i = 1; i <= this.pagesCount; i++)
				result.push(i);

		return result;
	}
	get pageMax() {
		var pageMax = this.itemsByPage() * this.currentPage;
		if (this.currentPage == this.pagesCount)
			pageMax = (this.itemsByPage() * (this.currentPage - 1)) + this.itemsCount - ((this.pagesCount - 1) * this.itemsByPage());
		return pageMax;
	}
	get itemsInPage() {
		var itemsInPage = [];
		for (var i = (this.itemsByPage() * (this.currentPage - 1)); i < this.pageMax; i++)
			itemsInPage.push(this.items[i]);
		return itemsInPage;
	}
	get columnsWithFilter() {
		var columnsWithFilter = [];
		if (this.columns != null) {
			for (var i = 0; i < this.columns.length; i++) {
				if (this.columns[i].filter != null && this.columns[i].filter) {
					columnsWithFilter.push(this.columns[i]);

					//add secKey to filter avanced
					if (this.columns[i].secKey != null && this.columns[i].secKey.filter)
						columnsWithFilter.push(this.columns[i].secKey);

					//add subKeys to filter avanced
					if (this.columns[i].subKeys != null && this.columns[i].subKeys.length > 0)
						for (var subKeyColumn of this.columns[i].subKeys)
							if (subKeyColumn.filter != null && subKeyColumn.filter)
								columnsWithFilter.push(subKeyColumn);
				}
			}
		}
		return columnsWithFilter;
	}
	get placeholder() {
		return this.lang.table.search + ((this.lang[this.type()] != null && this.lang[this.type()]['placeholder'] != null) ? ' ' + this.lang[this.type()]['placeholder'] : '') + ' ...';
	}
	get tooltipAdd() {
		return ((this.lang[this.type()] != null && this.lang[this.type()]['tooltipAdd'] != null) ? this.lang[this.type()]['tooltipAdd'] : '');
	}
	get isHideSort() {
		return (this.hideSort() || (this.hideFooter() && this.items.length <= 1));
	}
	get itemsFiltered() {
		return this.items;
	}

	changePage(page: any) {
		if (page > 0 && page <= this.pagesCount)
			this.currentPage = page;
	}

	renderItem(item: any, column: any) {
		if (item == null)
			return '';

		var result = item[column.key];
		if (column.type != null) {
			if (column.type == 'date')
				result = app.formatDate(result);
			else if (column.type == 'number' && column.amount)
				result = app.formatNumberWithDecimals(result);
			else if (column.type == 'number')
				result = app.formatNumber(result);
		}

		if (column.ref != null && column.type != 'number')
			result = app.getRefLabel(column.ref, result);

		if (column.template != null)
			result = app.formatString(column.template, result);

		return result;
	}

	getColumnLabel(column: any) {
		return (column.label != null) ? column.label : this.lang[this.type()][column.key];
	}

	getColumnTooltip(column: any) {
		return (this.lang != null && this.lang[this.type()] != null) ? this.lang[this.type()][column.type] : '';
	}

	getColumnSort(column: any) {
		var result = 'float-right fa fa-sort';
		return (column.key == this.currentSort) ? ((this.currentSortDesc) ? result + '-up current' : result + '-down current') : result;
	}

	showColumnSort(column: any) {
		if (column.amount != null && column.amount && (column.type == null || column.type == 'text'))
			return false;
		else if (column.action == null && !this.isHideSort && column.key != null)
			return true;
		else
			return false;
	}

	getColumnType(type: any) {
		if (this.forceAction != null)
			return this.forceAction();
		return type;
	}

	setUrlParam(param: any) {
		this.urlParam = param;
	}

	toggleBoolean(item: any, column: any, event?: any, uniqueChoice?: any) {
		if (Array.isArray(item) && !uniqueChoice) {
			if (event != null && event.target != null && event.target.className.toString().indexOf("bg-white") != -1) {
				for (var it of item)
					it[column] = true;
			}
			else {
				for (var it of item)
					it[column] = false;
			}
		}
		else if (!uniqueChoice)
			item[column] = app.toggleBoolean(item[column]);
		else {
			for (var it of this.items)
				if (it != item)
					it[column] = false;

			item[column] = app.toggleBoolean(item[column]);
		}

		this.edit.emit(item);
	}

	changeInputItem(item: any, column: any, index: any) {
		if (item.cmpCurrent != null) {
			item.columnName = column;
			app.evalFunction(item.cmpCurrent, item, item.nameFunction);
		}
		this.edit.emit(item);
	}

	applyBorderDanger(item: any, column: any) {
		return app.evalFunction(item.cmpCurrent, item, item.applyBorderDanger.nameFunction) && column == item.columnName;
	}

	isHighlightRow(item: any) {
		return (this.highlightIf != null && item[this.highlightIf()] == this.highlightIfValue());
	}

	isHighlightRowDeleted(item: any) {
		return (this.isHighlightRow(item) && this.highlightMode() == 'deleted');
	}

	isHighlightColCanceled(item: any) {
		return (this.isHighlightRow(item) && this.highlightMode() == 'canceled');
	}

	emit(type: any, item?: any) {
		if (this.forceAction != null)
			type = this.forceAction();

		if (type == 'goto') {
			if (!this.lineClickable()) { //Handling the case of several Clicks for non-clickable line
				if (!this.clickInProgress) {
					console.log("emit(goto) >> non clickable line > clickInProgress is ", this.clickInProgress);
					this.clickInProgress = true;
					this.goto.emit(item);
				}
			}
			else
				this.goto.emit(item);
		}
		else if (type == 'add') {
			if (!this.clickInProgress) {
				console.log("emit(add) >> clickInProgress is ", this.clickInProgress);
				this.clickInProgress = true;
				this.isLoadingBtnAdd = true;
				this.add.emit();

				var table = this;
				setTimeout(function () {
					table.clickInProgress = false;
					table.isLoadingBtnAdd = false;
				}, 2000);
			}
		}
		else if (type == 'treat')
			this.treat.emit(item);
		else if (type == 'affect')
			this.affect.emit(item);
		else if (type == 'edit')
			this.edit.emit(item);
		else if (type == 'payback')
			this.payback.emit(item);
		else if (type == 'update')
			this.update.emit(item);
		else if (type == 'delete')
			this.delete.emit(item);
		else if (type == 'validate')
			this.validate.emit(item);
		else if (type == 'file')
			this.file.emit(item);
		else if (type == 'addSPC')
			this.addSPC.emit(item);
		else if (type == 'select')
			this.select.emit(item);
		else if (type == 'refresh')
			this.refresh.emit();
		else if (type == 'export')
			this.export.emit();
	}

	incrementOrder(item: any) {
		this.incOrder.emit(item);
	}

	decrementOrder(item: any) {
		this.decOrder.emit(item);
	}

	isEnableAction(item: any, column: any) {
		if (column.enable)
			return app.enableTableAction(this.type() + '-' + column.type, item);
		return true;
	}

	toggleFilters() {
		this.unfolded = !this.unfolded;
	}

	initFilters() {
		this.filters = {};
		for (var column of this.columnsWithFilter)
			this.filters[column.key];
	}

	filterItems() {
		if (this.filter != null && this.filter != '') {
			this.items = [];
			var filter = this.filter.toUpperCase();
			var itemValue;

			this.resetPage();

			for (var item of this.itemsRaw) {
				for (var column of this.columns) {
					if (column.key != null && app.isNotEmpty(item[column.key])) {
						//verfier si c'est un montant on supprime les espaces
						if (column.amount)
							itemValue = String(this.renderItem(item, column)).toUpperCase().replace(/\s/g, '');
						else
							itemValue = String(this.renderItem(item, column)).toUpperCase();

						if (itemValue.indexOf(filter) != -1) {
							this.items.push(item);
							break;
						}
					}
				}
			}
		} else
			this.items = this.itemsRaw;

		//subfilters
		if (this.filters != null && this.items != null && this.items.length > 0) {
			var items = [];
			var notFoundItem;
			var itemValueSubKeys;
			var foundSubItem;

			this.resetPage();

			for (var item of this.items) {
				notFoundItem = false;
				foundSubItem = false;

				for (var column of this.columnsWithFilter) {
					if (app.isNotEmpty(this.filters[column.key])) {
						if (item[column.key] == null)
							item[column.key] = '';

						//verfier si c'est un montant on supprime les espaces
						if (column.amount)
							itemValue = String(this.renderItem(item, column)).toUpperCase().replace(/\s/g, '');
						else
							itemValue = String(this.renderItem(item, column)).toUpperCase();

						if (column.subKeys != null && column.subKeys.length > 0) {
							for (var columnSubKeys of column.subKeys) {
								foundSubItem = false;
								itemValueSubKeys = String(this.renderItem(item, columnSubKeys)).toUpperCase();

								if ((itemValueSubKeys.indexOf(this.filters[column.key].toUpperCase()) != -1))
									foundSubItem = true;
							}
						}

						if (itemValue.indexOf(this.filters[column.key].toUpperCase()) == -1)
							notFoundItem = true;
					}
				}
				if (!notFoundItem || foundSubItem)
					items.push(item);
			}
			this.items = items;
		}
	}

	sortByDefault() {
		for (var column of this.columns) {
			if (column.sort) {
				this.currentSort = column.key;
				this.currentSortDesc = true;
				this.sortItems(column);
			} else if (column.sortDesc) {
				this.currentSort = column.key;
				this.currentSortDesc = false;
				this.sortItems(column);
			}
		}
	}

	sortByCurrent() {
		for (var column of this.columns) {
			if (column.key == this.currentSort) {
				this.currentSortDesc = !this.currentSortDesc;
				this.sortItems(column);
			}
		}
	}

	sortItems(column: any) {
		if (this.isHideSort || !this.showColumnSort(column))
			return;

		if (this.currentSort == column.key)
			this.currentSortDesc = !this.currentSortDesc;
		else
			this.currentSortDesc = false;

		this.currentSort = column.key;

		var desc = this.currentSortDesc;

		this.items.sort(function (a: any, b: any) {
			if (column.type != null && column.type == 'number' && (column.amount == null || !column.amount)) {
				if (desc)
					return b[column.key] - a[column.key];
				else
					return a[column.key] - b[column.key];
			} else if (column.type != null && column.type == 'number' && column.amount) {
				if (typeof a[column.key] == 'string' && a[column.key].indexOf(',') != -1) {
					var aSplited = a[column.key].split(',');
					var bSplited = b[column.key].split(',');
					var aSplited1 = (aSplited.length > 1 && aSplited[1].length > 1) ? aSplited[1].substring(0, 2) : '00';
					var bSplited1 = (bSplited.length > 1 && bSplited[1].length > 1) ? bSplited[1].substring(0, 2) : '00';
					var aFormatted = app.convertStringToFloat((aSplited[0] + ',' + aSplited1).replace(/\D/g, ''));
					var bFormatted = app.convertStringToFloat((bSplited[0] + ',' + bSplited1).replace(/\D/g, ''));
					if (desc)
						return bFormatted - aFormatted;
					else
						return aFormatted - bFormatted;
				} else {
					if (desc)
						return b[column.key] - a[column.key];
					else
						return a[column.key] - b[column.key];
				}
			} else {
				var varA = (a[column.key] == null) ? '' : a[column.key];
				var varB = (b[column.key] == null) ? '' : b[column.key];

				if (varA < varB)
					return (desc) ? 1 : -1;
				if (varA > varB)
					return (desc) ? -1 : 1;
				return 0;
			}
		});
	}

	reset() {
		this.resetPage();

		this.currentSort = '';
		this.currentSortDesc = false;

		this.filter = '';

		if (this.filters != null)
			for (var column of this.columnsWithFilter)
				this.filters[column.key] = '';
	}

	resetPage() {
		this.currentPage = 1;
	}

	setLoading(loading: boolean) {
		this.loading = loading;
	}

	async getItems(skipDefault?: any) {
		this.loading = true;
		this.errorLoading = false;

		if (this.url != null) {
			var url = app.getUrl(this.url());
			if (this.urlParam != null)
				url = app.getUrl(this.url(), this.urlParam);

			this.itemsRaw = await app.getExternalData(url, 'cmp-table > ' + this.type() + ' > getItems');

			if (!Array.isArray(this.itemsRaw) && typeof this.itemsRaw == 'object')
				this.itemsRaw = [this.itemsRaw];
		} else
			this.itemsRaw = this.parentItems();

		if (this.itemsRaw == null) {
			this.itemsRaw = [];
			this.items = [];
			this.errorLoading = true;
		} else
			this.loading = false;

		app.setFocus('search');

		this.filter = '';

		this.filterItems();

		await app.sleep(100);

		if (skipDefault != null && skipDefault)
			this.sortByCurrent();
		else
			this.sortByDefault();
	}

	filterItemsBy(type: any, value: any) {
		if (this.filters[type] == value)
			this.filters[type] = '';
		else
			this.filters[type] = value;

		this.resetPage();
		this.filterItems();
		this.sortByDefault();
	}

	filterItemsSelected(type: any, value: any) {
		return (this.filters[type] == value);
	}

	survolActif(column: any, item: any) {
		return ((column.type == null || column.type == 'text') && !column.amount && item != null && item[column.key] != null && typeof item[column.key] == 'string' && item[column.key].indexOf('<') == -1);
	}

	getClick(event: any, item: any) {
		if (!this.lineClickable())
			return false;
		else if (event != null && event.target != null && event.target.className != null && event.target.className.indexOf('event-catcher') != -1)
			return false;
		else { //Handling the case of several Clicks for clickable line 
			if (!this.clickInProgress) {
				this.clickInProgress = true;
				this.emit('goto', item);

				var table = this;
				setTimeout(function () {
					table.clickInProgress = false;
				}, 2000);
			}
		}

		return;
	}

	setClickInProgress(value: boolean) {
		this.clickInProgress = value;
	}

	doRefresh() {
		if (this.url != null)
			this.getItems();
		else
			this.emit('refresh');
	}

	exportTable() {
		this.emit('export');
	}

	setLoadingBtnAdd(value: any) {
		this.isLoadingBtnAdd = value;
	}
}