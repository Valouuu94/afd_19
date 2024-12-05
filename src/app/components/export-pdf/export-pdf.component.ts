import { Component, OnInit } from '@angular/core';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

declare var pdfMake: any;
declare var pdfFonts: any

@Component({
    selector: 'app-export-pdf',
    templateUrl: './export-pdf.component.html',
    standalone: true
})
export class ExportPdfComponent implements OnInit {

	constructor() { }

	ngOnInit() { }

	generator(titreDuDocument: string, sousTitreDuDocument: string, tableContext: any, tableBody: any, piedDePage: string, fileName: string) {
		pdfMake = (window as any).pdfMake;
		pdfFonts = (window as any).pdfFonts;
		pdfMake.vfs = pdfFonts.vfs;

		var numColumns = tableContext[0].length;
		const columnWidthsContext = Array(numColumns).fill('*');
		const numColumns_2 = tableBody[0].length;
		const columnWidthsBody = []; // Définit la largeur des deux premières colonnes à 'auto'

		for (let i = 0; i < numColumns_2; i++)
			columnWidthsBody.push('auto'); // Ajoute des colonnes avec une largeur automatique

		let titre_ = titreDuDocument;
		let sousTitre_ = sousTitreDuDocument;

		// Définition des élements du PDF
		const documentDefinition: TDocumentDefinitions = {
			pageOrientation: 'landscape',
			content: [
				/*{
					image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxITEhUQEhMVFhIVFRUXFRgYFRUXFhkXFRYWFhUYFRccHiggGBoxHRcYIjEiJSkrLi4uFx81ODMtNygtLisBCgoKDg0OGhAQGy0mICUtLS0tLS0tLS0tLS0tLS0tLS8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAEAAQUBAQAAAAAAAAAAAAAABwMEBQYIAgH/xABPEAABAwICBgUGCQYMBwEAAAABAAIDBBEFIQYSMUFRYQcTcYGRFCIyQlKxI0NicoKSobLBJKKz0eHwCBUXMzQ1U1Rjc5TSJXSDk8LD0xb/xAAbAQEAAwEBAQEAAAAAAAAAAAAAAwQFAgEGB//EADQRAAIBAgMFBgYBBAMAAAAAAAABAgMRBCExBRJBUZETYXGB0fAiMqGxweHxFDNCUgYjgv/aAAwDAQACEQMRAD8AnFERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEReJJA0XJAHNAe0WGrMaa0HVAsPWdkP38FrVfpXH61S3sYbj8y91zvX0zLMMNJ/M7eJu01VGz0ntb2kBWcmO049e/Y1x+21lHcmkdPuLj2NP42VF2kEJ9v6o/WvH2v+pZhhKH+U/x6khu0npxvd9VfBpVTb3OHa134XUdfxvCfWI7Wn8E8pY7Y4Hvz8FFKdVar6FqOz8NLRvqvQk6HHqZ2yZg+cdT71lfxSBwu0gjiDcKIHqlHUSMOtG5zDxa4tPiFysS+KO5bGi/km14q/2t9iaEUY0Gm1RHlJqyN5+a7ucB7wVtuD6V01QQ3W1JDsY8gEnL0Tsd2XvyUsK0JcTPr7NxFFbzV1zWf7XQ2FERSlAIiIAiIgCIiAIiIAiIgCIiAIiIAisMVxSGmidPPI2ONu1x+wADNzjuAuTuUOaWdJk9STFS60EGY1gbTPHNw/mxyab5bcyFLTpSnp1PG7El6SabUlJdjn68w+LZ5zh87Oze8hRvi/SBVTHzAIm7vXf4kWHcO9aPGrlitRw0I65+Pp/J3GbWheT1T5DrSPc88XOLvC+xfWqixVmrt8iRFQKqFSCrsaTsBPYopFiIC9qo2mf7DvqlfTSvG1jvqlRMsQlF8UeWTOGwke7wVdtb7Q7x+pWxXxVakIy1RoUako6MvC8HYqEgVC699bxVCpRa0NWhWT1yZsuj2m01ORHLeWHmfPaPkE/dOWwAtUmYVisVRH1kTw5u8bHNPsuG0FQTIq+EYxNSyiWJ1jsLTcgjg5u8faNxCUsQ4ZPNFbG7Hp4hOVP4Z/R+K4eK87nQCLBaM6QxVkeuw6rxbrGEi7Ty4t4H3G4WdWhGSkrrQ+QqU505uE1ZrVBERenAREQBERAEREAREQBYTSjSOChgM8x5MYPSe7c1g/HYBmVc47i8VJA+pmdaNgueJOxrWje4mwA5rmnSrSSavqDUTZDZHGDdsbL5NbxPF288BYCxh6DqO70RzJ2LnSbSeor5utnNmgnq4gfMjB3N4u4uOZ5CwGOjVrErqNadklZHCLliumK1Ys9o9o7U1jtWBl2j0nu82Nva7eeQBPJRSaWbJUWTFewU9yL7929SdgnRtTxgOnc6Z+8C7GfYdY+NjwW4UWHQwi0UTGD5LQPG21VZYiC0zOt58CHKPApj6NPKefVvI8bWWTZgNUPiJPqlS2ij/qHyOGr6kTGjlZm+N7fnMcPeFUiKlVWVVhkMnpxtJ42s76wzTt+aPN0j8wtdk5ocOYBVrUaOxPzYSw+LfA5+BW41mjNs4nfRd+Dv1+KxToXMOq4EHgf3zT4ZklOrOn8rt75aGiYlg8sObm3b7Qzb38O9YxylVgvkcwdq1zHtFLgy0wz2mPjzj5/J8OBq1aT1ibWD2lFtRq5Pnw8+X28DSy5UpFUkVElZtSN80fU0ZWyZc4RistNK2aJ1nDaNzhvBG8Hh7rAqctHMajq4RPH2ObfNrxtHMcDvBCgArPaGaQOo5w7MxSWEg4i+RA4i5I8N6UK3ZvPT3mVdrbNWLp70F8cdO9cvTvy4k8IqUUgcA5pBaQCCMwQcwQeCqrUPhAiIgCIiAIiIAiLROl3SQ0lEYo3WnqbxsINi1lvhXjhYENB3F7TuXUIuclFcQ3YjHpV0uNbU9TE78lgcQyxykk2Pk5ja1vK59ZaMEAQLahBQioohLiJXUZVrEpP6M9DhIG11Q27L3gYRk4g/zjhvbf0Rv27LX4rVFTi5M7hFydkfdCNAXTas1SC2M5tjzDnD2n72t5bTy3zFR0rImNjjaGsaLAAAAdwX2mh1RzO1V1kzqSm7yJZNaIIiLg5CIiAIiIAqFVSskGq8X4cR2Hcq6IDWKugdEeLTsP4Hmvka2WRgcCCLg7Vg6mkMbreqdh/A81LGVzw1DTPRvXaamFvwgF5APXA2uA9ofaOe2O3KdolGOnuA9RL1zBaKUk8mv2ubyG8eG5U8VT/yXmfS7Exzb/p5/wDn0/K6cjUkRFmS1PrY6EsdFeOdbC6lefPhzZfaYycx9Fxt3gblv6580XxQ01TFN6ocNbmxx1XC2/aT3BdAtN9mxaOFqb0bcvaPidu4RUcR2kdJ5+fH8PzPSIismIEREAREQBc19KWOeVYjKQbxwHqI+HwZPWHtL9bPeA3gp90qxTyWjnqcrxRPc2+99rMHe4gd65VN95JO8naTvJV7BQu3Ly9TiZ8QIi0Dg2rQDRw11U2NwPUxjXmOzzQcmA8XHLsDiNi6IpIRcAABrQLACwFsgANw/UtQ6K8D8moGPcLS1Fpn8Q1w+Cb3Msbbi5y3ilblfisjFVe0qdyy9++BZgt2F+ZXREUBwEREAREQBERAEREAVGohD2lp7uRVZEBhGtIJB2hWmkOFeU00kPrWLo+Ug9HsvsPJxWXrosw7jke3d+/JeIl00pKzOoTlCSnHVO68Uc9kWyXxZ7Tmh6qumaBZrj1g7JBrG3K5I7lgViTVpNM/S6FRVKcZrRpPqLqdNA8Q66hhde7mDq3cbx+aL8y3VPeoLUo9D1ZeKaHc1zHj6bdU/cHipsLK1S3Mytv0VPCOXGLT65flEjIiLTPhwiIgCIiAjrpxrdTDhEPjp42HsZrTX8Y2+KgJTF/CCnNqKPcTO89rBE0fY9yh1auEjaku+/p+COWoV9gOHeU1MFN/aysY75pcNc9zdY9ysVunQ/Sh+KxE/FMmk79Qxj9JfuU85bsXLkn9jy12dAFoGQFgMgOA3K7iGQ7ArWRXjdiwkWZ6H1EWA04x3yKimqRbXDdWIHMGV/mx3G8XNzyBXSTbsiMjTSPpDkjxppbI7ySneIJWBx1HA3E8jm73Nc7L/JHtFTQDfNc0UOiMkuF1GJ3cTHK3VBz1423FQ8nf5zwb/wCC/ipg6I8e8qw9jHm8tMepfxLWj4J31LAneWuVvE0oqKcOGT9TiL5m7SbD2Fc56OY3jda4xU1VM97Wa7h1kbfNuATd1t7gujJvRPYfcufuhLE4KeqkfPNFEw0+qHSSNjaTrxmwLiATYHLkvMO7QnK12rd/M9lwMt/E+lP9rL/qKf8AWt76OKTE445hiTnOeXt6vWkY/wA3Vz9A5ZrL/wD7DDf7/R/6mH/cr7DcWp6gF1PPFMGmzjHIyQAnYCWk2KjqVpSjZxS8EEiBYccxmqrJqalqZnPbJOWs142gMjkLci6wyuN6y0lNpVCNfWncBmbPppT9S5J7ACqPRX/Xs3ZWfpmqeFYrVezluqMdFwPIq5EGh/Sy/rRTYk1rDravXBpZqO2WnjPo57XC1t4AuRL6ifpz0djMDcQY0CVj2xynZrxv81utxcHaoHJx4BbH0RYq6ow2LXN3wudCTvsyxZfnqOYoasIumqkFbg0ep52Zt9Sy7T4+Cs4lkljYwoEdEbdLkFp4ZPai1T9Bzjf877FoakbpgH9G7Zv/AFKOVkYhWqy98Eff7Gd8FTfc/pJoLe+iBx8qmbuMRPeHx295WiLd+iX+mO/yX/ejXNH+5HxJdqK+Dq+H7JgREWufnYREQBERAQr/AAgT8NR/5c/3olE6mD+EHCfyKTcPKGk83dSWj81yh9a+F/sx8/uyOWoUhdBo/wCJP/5WW3/dgUereOhupDMUjafjIpox26vWe6Mrqur05eB4tUT7IrqPYOwK1kVemd5vYsRFmayKygzpzx4yVEdAwjVhGvJmAOtkFmBxOQsw3vs+FPBTLjOIspoJaiQ2ZExz3djRew5nYOZUCaCaNnGaqpnqZHtjzkkdGW3MsrrtY0ua4aoAdluAYN6uYVJN1JaR/JDLkSnguLYRBRR0HltI6NsXVvHXRWfrA9aSL+sS4n5xUZdGWKtocVdTiRr6eZ7qfXa4Oa6zj5PIHDIknzf+qeC3j+RWg/t6z68H/wAVpPSXoCzDo4qinkmdG55ZI6RzNZj7a0TmljG2GTszsIbxUlLsneG8/i5rieO+pP03onsPuXNHRtoqzEZnQSSPjDIesBYGkkhzG2OsDl5ynfQvHhXUEVTca5YWy22CVnmyWG4Ei45OCifoAePLZRcX8lP6SJc0N6EKnBq35Es7GzfyJU397qPCL/atu0I0Ojw5kjI5XyCVzXEvDQQWi2WqAtnRQTrVJq0nkdJJED9Ff9ezdlZ+map4XMeEaTfxfiU9U1jZCJKlmq5+p6cpN72Ps8N62ubpqqpBqQUsQkOTfPfMe5jQ0k96tV8PUnK8VwOYySRtPTlirGUApr/CTyMsN+pE4SOd2XDR9JXPQpQmPDWvII6+WSUX4ebG09hEYI7Vo+A6D4hilR5XiPWRxG2sXjUke0E2jijyMTduZA9K4uSSpxpoGxsbGxoaxjQ1rQLBrWizQBuAAsoqrjCmqSd3e7PVm7lZY8bT2lZBY2MqujojjpdlBmgj4Rlx+m8gfcK0FbH0g1vW10tjdserEO1g8788vWuLHrS3qjfefomzKbp4SnF8r9c/yFvXRC38qkO4QO8XPjt9gK0VSb0O0lm1E24uYwdwJd72pQV6iONrz3MFUfcl1aRJSIi1j8+CIiAIiICN+najL8PZKPiahjj817Xx/eexQKuptNMKNVQ1NOBdz4nag/xG+fH+e1q5Zabi/FaeClem1yf3I5ahZTRjEvJqynqSbCOZjnH5BOrJ+YXLFpZW2k1ZnJ1rIlM+zrcfetV6Nsc8roInON5Yh1MvHWjA1XHtYWu7SeC2J5WBOLhJxfAvRtJGTIvtRrQNgAXink1hfx7VVXpXtYLy5oO1ekQHljQNgsvjWAbAB3L2iAIiIDx1beA8AvrWgbAAvSIAiIgKNQ+zSeXvyWGxXERTwyTO9RpIHFx9Bve4gLI18mxvefwUXdJGOa7xSsPmxm8hG+S1iPognvceC5qT3IXLmBwrxNeMOGr8P3ou80mSQkuc43JJJPEnMnxXlEWPLU/RIhTh0d4f1NDHcWdJeQ/SyZ+YG+Kh3AsPdUVEcDb3e9oy3N2uPcB9i6EhiDWhjRZrQABwAFgFbwcficvI+c/5HiLU4UVxe8/BZLq79CqiIr58kEREAREQBcxdI2CeSYhPEBaN7uui+ZKSbDkHB7forp1Rx006OeUUgqmC8tLrOPEwut1vhYP7Gu4qzham5Us9HkcyV0QIgRAtUjNz6M9JRRVXwjrU8wDJb7GkE9XIewkg8nk7gp5kXLcSl3oy0v12toah3wjRaB59Zo2RuPtDdxGW0Z5+No3+NeZYoTtkyRYZ9Q33b1lWOBFxmCsHIvVPVmM8W7x+IWcpWLVSlv5rUzqKlBM14u03CqrsptWCIiAIiIAiIgCpyyBoLjsC9E2zWh6W6YNZeOKznjva08XcTwb422Jks2SUqU6styCuxpfpL1DSxh+HkGW/Uactc8+A5clFb3fucz3lXNTM57i95LnON3E7SeatXKlWm5M+y2dhI4anurNvV836LRefMpoiyujODPqqhkLch6T3ezGCLntzt3hU2ruyNhzjCDlJ2Szb7jeOibA7NdWvGZuyLsv57h3gN7nKSlbUdMyONsTBZjGhrRwAFh2q5WrSp7kUj88xuLeKryqvjouSWnvmERFIVAiIgCIiALy5oIscwdq9IgOaeknRQ0FUQwfk0t3wncB60Z5tJy+SW77rUwuqNK9H4q6mdTS5A5scBdzHgHVe3nmRzBI3rmfHMGmo53007dWRh+i5p9F7Dvabe8GxBA1sNW7SNnqvd/UjkrMt4ldRHeNo2ceRCtoldRqZniJQ0Q08DgIKx1nbGzHY7lL7J+VsO+xzO8PXP8a2TANKJ6YBgOvF7DibD5h2t93JZtfC3d4dPf8AHgXaNe2UiV2TOYdZpsf328VkqbHG7JBY8RmPDaPtWmYfpZTS7XdW7g/Idz9njbsWVLgRcG44jYs+W9TdnkXuzp1l6G5QTteLtIcORuqyj9xINxkeI2qo3F527JXd9nfeBTtuaI3s5v5Zdf16G+ItEOktSPWH1Wq0qNKKkDOUNHzWD3hO2iFsuq+K+voSMsLimktNADrSAkeqzzndmWQPaQoyxHSCSS4dI9/a46v1f2LCySF20/qXW9N8LeJLDZ1NfPK/ctOv68zZNI9NZ57xx/BRcj57vnO3DkPErUyvZXhy4ma2Hpwpq0FZFN6ouVd6UlI+V7Yo2lzibADaT+A4nYBtVWZqUtClSUr5HtjjBLnEBoG0kqbtD9HW0cIbkZXWMrhsv7Lfki57czvsrbQvRJlI3XcAahw8525t/VZ+J3rbFPQo7vxS1+x83tfaixH/AE0n8C1f+z9Fw56vhYiIrRhBERAEREAREQBERAFrOm2iUOIw6j/NlZcwygXcwnaCPWYbC7fcQCNmRexbi7oHK2M4LPRzGnqGajxs3te3c+N3rN+0bCAbhUol0vpFo9T1sXU1DNYbWuGT2O9pjtx+w7CCMlCelegdTREvt1tNmetaM2j/ABW+r87NuW0XstOjiVUyeT96EbjY11jVXYqUSumBSNHsZHtiuaaoez0Hub81xHuVFsR3L2AoZLgyzBp6GUjxyoHxp7w0+8KocbnPrj6rf1LFBVQq8qcOS6FuNSfN9S8fiErtrz3Ze5W5Nzc5leQvajcUtCdNvU+r4vq+KGRbpngrw5ZShwSeUjVjNjvd5o7r5nuBW74BoBGyz6jz3bdUZN+lvP75KJwbO5YyjR+Z3fJZv9edjScB0aqKx1o26sYPnSOuG8wDvdyHK9tqlfRzRuCkZaMXeR5z3ekeQ9lvLxuc1mIYWtAa0BrQLAAAAAbAANgVVexpRi78TJxe0quIW5pHkuPi+P0XHXMIiKQzwiIgCIiAIiIAiIgCIiAIiIAiIgNK0h6OqSoJfF+TynO7AOrJ4ujyH1S0nfdaFiug1bT3PV9awetFd3iz0ge4jmpyRTQxE45a++p44o50YLEg5EZEHaDzG5XMYU612GwTfzsTH8NZrSR2E5hYSo0FoneixzD8l7vc64CnWJi9Uc7pFbaZp3eCrNw9p3n7FIjuj6D1ZpR26h9zQvrNA2D45/1QvHVps7U5rRkfMwkH1z4ftVxHgjd7z4BSHDoXANr5D3tA+6sjT6PUzPi7n5RLvsJt9ijdSBIq9VcSPKPR+NxsA954XP8A4hbRheierYljI+4Of4/tW2xRNaLNAA4AAD7FUUTnyR5KpOWUpPqWlLQMj9EZ8Tmf2dyu0RcHAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAf/Z',
					width: 60,
					height: 60
				},*/
				{
					text: '\n',
					style: 'subheader',
					alignment: 'center'
				},
				{
					table: {
						widths: [751],
						body: [
							[{ text: titre_, style: 'header', alignment: 'center', fillColor: '#E8E2E1', margin: [5, 10, 5, 10] }]
						]
					}
				},
				{
					text: '\n',
					style: 'subheader',
					alignment: 'center'
				},
				{
					text: sousTitre_,
					style: 'subheader',
					alignment: 'center'
				},
				{
					table: {

						headerRows: 1,
						widths: columnWidthsContext,
						body: tableContext,
					},
					layout: {
						defaultBorder: false,
					},
					style: { fontSize: 10, color: '#484F4F' }
				},
				{
					text: '',
					style: 'subheader',
					alignment: 'center'
				},
				{
					style: 'tableExample',
					table: {
						widths: columnWidthsBody,
						body: tableBody
					}
				}
			],
			styles: {
				header: {
					fontSize: 12,
					bold: true,
					margin: [0, 0, 0, 10],
				},
				subheader: {
					fontSize: 12,
					bold: true,
					margin: [0, 0, 0, 10]
				},
				tableExample: {
					margin: [0, 5, 0, 15],
					fontSize: 9
				},
				tableHeader: {
					bold: true,
					fontSize: 9,
					color: 'black'
				}
			},
			header: function (currentPage: { toString: () => string; }, pageCount: { toString: () => string; }) {
				return {
					columns: [
						{
							text: '\n' + ' Agence Française de Développement  ' + '\n' + 'Contrôle des versements',
							alignment: 'left',
							margin: [20, 0, 10, 0],
							fontSize: 9,
							bold: true
						},
						{
							text: '\n' + new Date().toLocaleDateString() + '\n' + 'Page ' + currentPage.toString() + ' sur ' + pageCount.toString(),
							alignment: 'right',
							margin: [20, 0, 10, 0],
							fontSize: 9,
							bold: true
						}
					]
				};
			},
			footer: function () {
				return {
					columns: [
						{

							text: piedDePage,
							alignment: 'left',
							margin: [20, 0, 10, 0],
							fontSize: 9,
							bold: true
						}
					]
				};
			}
		};
		pdfMake.createPdf(documentDefinition).download(fileName);
	}
}