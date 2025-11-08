import { TestBed } from '@angular/core/testing';

import { AwbServiceService } from './awb-service.service';

describe('AwbServiceService', () => {
  let service: AwbServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AwbServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
