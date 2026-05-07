import { NgClass } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  ViewChildren,
  QueryList,
  input,
  output,
  signal,
} from '@angular/core';
import { methodTone } from '../../utils/http-method.utils';

export interface WorkspaceTabLike {
  id: string;
  title: string;
  method?: string;
  protocol?: string;
  dirty?: boolean;
}

interface ContextMenuState {
  tabId: string;
  x: number;
  y: number;
  /** Index do tab para "fechar à direita". */
  index: number;
  total: number;
}

@Component({
  selector: 'app-request-tabs',
  standalone: true,
  imports: [NgClass],
  template: `
    <div
      class="flex min-w-0 items-center gap-1 overflow-x-auto border-b border-white/5 pb-1"
    >
      @for (t of tabs(); track t.id; let idx = $index) {
        <div
          class="group relative flex min-w-0 max-w-[16rem] items-center gap-1 rounded-t-lg border border-transparent px-1 py-1 transition"
          [ngClass]="{
            'border-white/10': t.id === activeId(),
            'bg-slate-900/60': t.id === activeId(),
          }"
          (auxclick)="onAuxClick($event, t.id)"
          (contextmenu)="onContextMenu($event, t.id, idx)"
        >
          <span
            class="inline-flex shrink-0 items-center justify-center rounded border px-1 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide"
            [ngClass]="toneFor(t).pill"
            [style.minWidth.rem]="2.4"
          >
            {{ toneFor(t).label }}
          </span>
          @if (editingId() === t.id) {
            <input
              #renameInput
              [attr.data-tab-id]="t.id"
              type="text"
              class="min-w-0 flex-1 rounded border border-junny-violet/40 bg-slate-950 px-2 py-1 text-sm text-slate-100 focus:border-junny-violet/60 focus:outline-none"
              maxlength="200"
              [value]="editingValue()"
              (input)="editingValue.set($any($event.target).value)"
              (keydown.enter)="commitRename(t.id); $event.preventDefault()"
              (keydown.escape)="cancelRename(); $event.preventDefault()"
              (blur)="commitRename(t.id)"
              (click)="$event.stopPropagation()"
            />
          } @else {
            <button
              type="button"
              class="min-w-0 flex-1 truncate px-1.5 py-1.5 text-left text-sm"
              [class.text-slate-200]="t.id === activeId()"
              [class.text-slate-500]="t.id !== activeId()"
              [title]="renameHint"
              (click)="tabSelected.emit(t.id)"
              (dblclick)="beginRename(t); $event.stopPropagation()"
            >
              {{ t.title }}
            </button>
          }
          @if (t.dirty) {
            <span
              class="shrink-0 px-1 text-junny-violet"
              title="Unsaved changes"
              aria-label="Unsaved changes"
            >
              ●
            </span>
          }
          <button
            type="button"
            class="shrink-0 rounded px-1.5 text-slate-600 transition hover:text-rose-300"
            [class.opacity-0]="!t.dirty && t.id !== activeId()"
            [class.group-hover:opacity-100]="true"
            (click)="tabClosed.emit(t.id); $event.stopPropagation()"
            aria-label="Close tab"
            title="Close tab"
          >
            ×
          </button>
        </div>
      }
      <button
        type="button"
        class="shrink-0 rounded-lg px-2 py-1.5 text-lg text-junny-blue hover:bg-white/5"
        (click)="tabAdded.emit()"
        title="New tab"
      >
        +
      </button>
    </div>

    @if (contextMenu(); as ctx) {
      <div
        class="fixed inset-0 z-[60]"
        (click)="closeContextMenu()"
        (contextmenu)="closeContextMenu(); $event.preventDefault()"
      >
        <ul
          class="absolute min-w-[10rem] rounded-lg border border-white/10 bg-slate-900/95 py-1 text-xs text-slate-200 shadow-xl backdrop-blur"
          [style.left.px]="ctx.x"
          [style.top.px]="ctx.y"
          (click)="$event.stopPropagation()"
          role="menu"
        >
          <li>
            <button
              type="button"
              class="flex w-full items-center justify-between px-3 py-1.5 hover:bg-white/5"
              (click)="onMenuRename(ctx.tabId)"
            >
              <span>Rename</span>
              <span class="ml-4 text-[10px] text-slate-500">⏎</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              class="flex w-full items-center justify-between px-3 py-1.5 hover:bg-white/5"
              (click)="onMenuDuplicate(ctx.tabId)"
            >
              <span>Duplicate</span>
            </button>
          </li>
          <li role="separator" class="my-1 border-t border-white/5"></li>
          <li>
            <button
              type="button"
              class="flex w-full items-center justify-between px-3 py-1.5 hover:bg-white/5"
              (click)="onMenuClose(ctx.tabId)"
            >
              <span>Close</span>
              <span class="ml-4 text-[10px] text-slate-500">⌘W</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              class="flex w-full items-center justify-between px-3 py-1.5 text-left hover:bg-white/5 disabled:opacity-40"
              [disabled]="ctx.total <= 1"
              (click)="onMenuCloseOthers(ctx.tabId)"
            >
              <span>Close others</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              class="flex w-full items-center justify-between px-3 py-1.5 text-left hover:bg-white/5 disabled:opacity-40"
              [disabled]="ctx.index >= ctx.total - 1"
              (click)="onMenuCloseToRight(ctx.tabId)"
            >
              <span>Close to the right</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              class="flex w-full items-center justify-between px-3 py-1.5 text-left hover:bg-white/5 disabled:opacity-40"
              [disabled]="ctx.total <= 1"
              (click)="onMenuCloseAll()"
            >
              <span>Close all</span>
            </button>
          </li>
        </ul>
      </div>
    }
  `,
})
export class RequestTabsComponent {
  readonly tabs = input.required<WorkspaceTabLike[]>();
  readonly activeId = input.required<string>();
  readonly tabSelected = output<string>();
  readonly tabClosed = output<string>();
  readonly tabAdded = output<void>();
  readonly tabRenamed = output<{ id: string; title: string }>();
  readonly tabDuplicated = output<string>();
  readonly tabsClosedOthers = output<string>();
  readonly tabsClosedToRight = output<string>();
  readonly tabsClosedAll = output<void>();

  readonly editingId = signal<string | null>(null);
  readonly editingValue = signal('');
  readonly contextMenu = signal<ContextMenuState | null>(null);

  protected readonly renameHint = 'Double-click to rename · right-click for actions';

  protected toneFor(tab: WorkspaceTabLike) {
    return methodTone(tab.method, tab.protocol);
  }

  @ViewChildren('renameInput') private renameInputs?: QueryList<
    ElementRef<HTMLInputElement>
  >;

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.contextMenu()) this.closeContextMenu();
  }

  beginRename(tab: WorkspaceTabLike): void {
    this.editingId.set(tab.id);
    this.editingValue.set(tab.title);
    queueMicrotask(() => {
      const input = this.renameInputs?.find(
        (el) => el.nativeElement.dataset['tabId'] === tab.id,
      );
      const node = input?.nativeElement;
      if (node) {
        node.focus();
        node.select();
      }
    });
  }

  cancelRename(): void {
    this.editingId.set(null);
    this.editingValue.set('');
  }

  commitRename(tabId: string): void {
    if (this.editingId() !== tabId) return;
    const tab = this.tabs().find((t) => t.id === tabId);
    if (!tab) {
      this.cancelRename();
      return;
    }
    const next = this.editingValue().trim();
    this.editingId.set(null);
    this.editingValue.set('');
    if (!next || next === tab.title) return;
    this.tabRenamed.emit({ id: tabId, title: next });
  }

  onAuxClick(ev: MouseEvent, tabId: string): void {
    if (ev.button !== 1) return;
    ev.preventDefault();
    this.tabClosed.emit(tabId);
  }

  onContextMenu(ev: MouseEvent, tabId: string, index: number): void {
    ev.preventDefault();
    ev.stopPropagation();
    const total = this.tabs().length;
    this.tabSelected.emit(tabId);
    this.contextMenu.set({
      tabId,
      x: ev.clientX,
      y: ev.clientY,
      index,
      total,
    });
  }

  closeContextMenu(): void {
    this.contextMenu.set(null);
  }

  onMenuRename(tabId: string): void {
    this.closeContextMenu();
    const tab = this.tabs().find((t) => t.id === tabId);
    if (tab) this.beginRename(tab);
  }

  onMenuDuplicate(tabId: string): void {
    this.closeContextMenu();
    this.tabDuplicated.emit(tabId);
  }

  onMenuClose(tabId: string): void {
    this.closeContextMenu();
    this.tabClosed.emit(tabId);
  }

  onMenuCloseOthers(tabId: string): void {
    this.closeContextMenu();
    this.tabsClosedOthers.emit(tabId);
  }

  onMenuCloseToRight(tabId: string): void {
    this.closeContextMenu();
    this.tabsClosedToRight.emit(tabId);
  }

  onMenuCloseAll(): void {
    this.closeContextMenu();
    this.tabsClosedAll.emit();
  }
}
