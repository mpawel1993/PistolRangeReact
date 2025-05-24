package pl.pistolrange.pistolrange_server.api.dto;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PossibleAnswerDto {
    private String id;
    private String value;
}
