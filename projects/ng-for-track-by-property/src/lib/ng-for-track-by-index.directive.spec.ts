import { CommonModule, NgForOf } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { NgForTrackByIndexDirective } from './ng-for-track-by-index.directive';

@Component({
  imports: [ CommonModule, NgForTrackByIndexDirective ],
  standalone: true,
  template: '<span *ngFor="let name of items; trackByIndex">{{ name }}</span>',
})
class TestComponent {
  public readonly items: string[] = [ 'Alice', 'Bob', 'Carol' ];
}

describe('NgForTrackByIndexDirective', (): void => {
  beforeEach((): void => {
    TestBed.configureTestingModule({ imports: [ TestComponent ] });
  });

  it('should track by array index', (): void => {
    const fixture = TestBed.createComponent(TestComponent);
    const testComponent = fixture.componentInstance;
    const mockNgForOf = {} as NgForOf<string>;
    new NgForTrackByIndexDirective<string>(mockNgForOf);

    expect(mockNgForOf.ngForTrackBy).toBeDefined();

    for (const [ indx, item ] of testComponent.items.entries()) {
      const ret = mockNgForOf.ngForTrackBy(indx, item) as number;
      expect(ret).toBe(indx);
    }
  });

  it('should apply trackBy function', (): void => {
    const fixture = TestBed.createComponent(TestComponent);
    const testComponent = fixture.componentInstance;
    const [ node ] = fixture.debugElement.queryAllNodes(By.directive(NgForOf));
    if (node) {
      const { injector } = node;
      const ngForOfDir = injector.get(NgForOf);
      // @ts-expect-error Spy on private property for testing
      const trackBySpy = spyOn(ngForOfDir, '_trackByFn').and.callThrough();

      fixture.detectChanges();
      expect(trackBySpy).toHaveBeenCalledTimes(3);
      expect(trackBySpy).toHaveBeenCalledWith(0, testComponent.items[0]);
      expect(trackBySpy).toHaveBeenCalledWith(1, testComponent.items[1]);
      expect(trackBySpy).toHaveBeenCalledWith(2, testComponent.items[2]);
    } else {
      fail('could not find DebugNode for NgForOf');
    }
  });
});
