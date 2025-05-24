package pl.pistolrange.pistolrange_server.api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PossibleAnswerDto {
    private String id;
    private String value;
}
