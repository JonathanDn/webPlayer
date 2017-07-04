import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import 'rxjs/Rx';

@Injectable()
export class PlayerService {
    private APIKey = 'BLP6OT754UDWMJSO';
    private baseUrl = 'https://freemusicarchive.org/api/get/';
    private currTrackUrl;
    constructor(private http: Http) {}
    getTrackData(id) {
        this.setTrackById(id);
        let observable = this.http.get(this.currTrackUrl)
            .map(res => res.json().dataset[0]);
        return observable;
    }

    setTrackById(id) {
        this.currTrackUrl = this.baseUrl + 'tracks.json?api_key=' + this.APIKey + '&track_id=' + id;
    }
}
