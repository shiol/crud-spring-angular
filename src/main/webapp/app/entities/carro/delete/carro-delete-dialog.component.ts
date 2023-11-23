import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ICarro } from '../carro.model';
import { CarroService } from '../service/carro.service';

@Component({
  standalone: true,
  templateUrl: './carro-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class CarroDeleteDialogComponent {
  carro?: ICarro;

  constructor(
    protected carroService: CarroService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.carroService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
